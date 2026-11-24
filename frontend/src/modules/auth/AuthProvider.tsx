import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import axios, { type InternalAxiosRequestConfig } from 'axios';
import { api } from '../../lib/api';
import { AuthContext } from './useAuth';
import { getMeApi, loginApi, logoutApi, refreshApi, type LoginData } from './auth.api';
import { authStateKey, readAuthState, withAuthLock, writeAuthState } from './auth-coordination';

type AuthRequest = InternalAxiosRequestConfig & { authVersion?: string; authRetried?: boolean };
const uncertainMessage = 'Không thể xác minh phiên. Vui lòng thử đăng xuất lại khi kết nối ổn định trước khi đăng nhập.';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<LoginData | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [accountError, setAccountError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState('');
  const logoutUnconfirmed = !session && logoutError !== '';
  const currentSession = useRef<{ data: LoginData; version: string } | null>(null);
  const loggingOut = useRef(false);
  const refreshPromise = useRef<Promise<void> | null>(null);
  const restoreStarted = useRef(false);
  const userId = session?.user.id;

  function saveSession(data: LoginData | null, version: string) {
    currentSession.current = data ? { data, version } : null;
    setSession(data);
  }

  function stopSession(message: string, pending: boolean) {
    saveSession(null, '');
    setAccountError(message);
    if (pending) setLogoutError(uncertainMessage);
    writeAuthState({ version: crypto.randomUUID(), pending });
  }

  const accountApi = useMemo(() => {
    const instance = axios.create({ baseURL: api.defaults.baseURL });
    instance.interceptors.request.use((config: AuthRequest) => {
      const current = currentSession.current;
      if (!current || loggingOut.current || readAuthState()?.version !== current.version) {
        throw new Error('Phiên đăng nhập đã thay đổi. Vui lòng đăng nhập lại.');
      }
      if (config.authVersion && config.authVersion !== current.version) {
        throw new Error('Không gửi lại request của phiên đăng nhập cũ.');
      }
      config.authVersion = current.version;
      config.headers.Authorization = `Bearer ${current.data.accessToken}`;
      return config;
    });
    instance.interceptors.response.use(response => {
      const config = response.config as AuthRequest;
      if (loggingOut.current || config.authVersion !== currentSession.current?.version
        || readAuthState()?.version !== config.authVersion) {
        throw new Error('Bỏ qua phản hồi của phiên đăng nhập cũ.');
      }
      // This private client only loads /me; never apply another account's response.
      if (response.data?.data?.id !== currentSession.current?.data.user.id) {
        stopSession('Thông tin phiên không khớp tài khoản đang đăng nhập. Vui lòng đăng xuất rồi đăng nhập lại.', true);
        throw new Error('Unexpected account response');
      }
      return response;
    }, async error => {
      if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) throw error;
      const config = error.config as AuthRequest;
      const current = currentSession.current;
      if (!current || loggingOut.current || config.authVersion !== current.version
        || readAuthState()?.version !== current.version) throw error;
      if (config.authRetried) {
        stopSession('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.', false);
        throw error;
      }
      config.authRetried = true;

      // A delayed 401 may use the old token after another request already refreshed.
      if (config.headers.Authorization === `Bearer ${current.data.accessToken}`) {
        if (!refreshPromise.current) {
          refreshPromise.current = withAuthLock(async () => {
            const state = readAuthState();
            if (loggingOut.current || currentSession.current?.version !== current.version
              || state?.version !== current.version) throw new Error('Phiên đăng nhập đã thay đổi.');
            if (state.pending) {
              stopSession(uncertainMessage, true);
              throw new Error(uncertainMessage);
            }
            // Persist before sending so a closed tab cannot leave another tab retrying unknown rotation.
            writeAuthState({ ...state, pending: true });
            try {
              const { data: body } = await refreshApi();
              const data = body?.data;
              if (body?.success !== true || !data || typeof data.accessToken !== 'string'
                || !data.accessToken || data.tokenType !== 'Bearer'
                || !Number.isFinite(data.expiresIn) || data.expiresIn <= 0) {
                throw new Error('Unexpected refresh response');
              }
              if (readAuthState()?.version !== state.version) throw new Error('Phiên đăng nhập đã thay đổi.');
              writeAuthState({ ...state, pending: false });
              if (!loggingOut.current && currentSession.current?.version === current.version) {
                saveSession({ ...current.data, ...data, user: current.data.user }, current.version);
              }
            } catch (refreshError) {
              if (readAuthState()?.version !== state.version) throw refreshError;
              const status = axios.isAxiosError(refreshError) ? refreshError.response?.status : undefined;
              const pending = !status || status >= 500;
              const message = status === 401
                ? 'Không thể gia hạn phiên. Vui lòng đăng nhập lại.'
                : status === 403 ? 'Không thể gia hạn phiên do yêu cầu bị từ chối.' : uncertainMessage;
              stopSession(message, pending);
              throw refreshError;
            }
          }).finally(() => { refreshPromise.current = null; });
        }
        await refreshPromise.current;
      }
      if (loggingOut.current || currentSession.current?.version !== current.version
        || readAuthState()?.version !== current.version) throw error;
      return instance(config);
    });
    return instance;
  }, []);

  async function login(credentials: { email: string; password: string }) {
    if (isRestoring) throw new Error('Đang khôi phục phiên. Vui lòng chờ.');
    await withAuthLock(async () => {
      if (readAuthState()?.pending) throw new Error(uncertainMessage);
      const state = { version: crypto.randomUUID(), pending: true };
      writeAuthState(state);
      try {
        const { data: body } = await loginApi(credentials);
        if (body?.success !== true || !body.data) {
          throw new Error(body?.error?.details?.map(issue => issue.message).join(' ')
            || body?.error?.message || 'Không thể đăng nhập lúc này. Vui lòng thử lại sau.');
        }
        writeAuthState({ ...state, pending: false });
        saveSession(body.data, state.version);
        setAccountError('');
        setLogoutError('');
      } catch (error) {
        const status = axios.isAxiosError(error) ? error.response?.status : undefined;
        const pending = !status || status >= 500;
        stopSession(pending ? uncertainMessage : '', pending);
        throw error;
      }
    });
  }

  async function logout() {
    if (isRestoring) return;
    if (loggingOut.current) return;
    loggingOut.current = true;
    setIsLoggingOut(true);
    setLogoutError('');
    setAccountError('');
    try {
      const requestedVersion = readAuthState()?.version;
      await withAuthLock(async () => {
        const sharedState = readAuthState();
        if (sharedState?.version !== requestedVersion) {
          saveSession(null, '');
          setAccountError('Phiên đăng nhập đã thay đổi. Yêu cầu đăng xuất cũ đã được bỏ qua.');
          setLogoutError(sharedState?.pending ? uncertainMessage : '');
          return;
        }
        const state = sharedState ?? { version: crypto.randomUUID(), pending: false };
        writeAuthState({ ...state, pending: true });
        try {
          const response = await logoutApi();
          if (response.status !== 204) throw new Error('Unexpected logout response');
          writeAuthState({ version: crypto.randomUUID(), pending: false });
          saveSession(null, '');
        } catch (error) {
          if (axios.isAxiosError(error) && error.response?.status === 403) writeAuthState(state);
          else stopSession(uncertainMessage, true);
          throw error;
        }
      });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setLogoutError('Không thể đăng xuất do yêu cầu bị từ chối. Vui lòng thử lại.');
      } else {
        saveSession(null, '');
        setLogoutError(uncertainMessage);
      }
    } finally {
      loggingOut.current = false;
      setIsLoggingOut(false);
    }
  }

  useEffect(() => {
    // StrictMode chạy effect hai lần khi phát triển; chỉ gửi refresh một lần.
    if (restoreStarted.current) return;
    restoreStarted.current = true;

    async function restoreSession() {
      try {
        await withAuthLock(async () => {
          const state = readAuthState() ?? { version: crypto.randomUUID(), pending: false };
          if (state.pending) throw new Error(uncertainMessage);
          writeAuthState({ ...state, pending: true });
          let refreshCompleted = false;
          try {
            const { data: body } = await refreshApi();
            const tokens = body?.data;
            if (body?.success !== true || !tokens || !tokens.accessToken
              || typeof tokens.accessToken !== 'string' || tokens.tokenType !== 'Bearer'
              || !Number.isFinite(tokens.expiresIn) || tokens.expiresIn <= 0) {
              throw new Error('Unexpected refresh response');
            }
            if (readAuthState()?.version !== state.version) return;
            writeAuthState({ ...state, pending: false });
            refreshCompleted = true;

            // Chưa có session nên gửi Bearer trực tiếp, chưa dùng interceptor.
            const { data: userBody } = await getMeApi(api, tokens.accessToken);
            if (!userBody?.data || typeof userBody.data.id !== 'string') {
              throw new Error('Unexpected account response');
            }
            if (readAuthState()?.version !== state.version) return;
            saveSession({ ...tokens, user: userBody.data }, state.version);
            setLogoutError('');
          } catch (error) {
            if (readAuthState()?.version !== state.version) return;
            const status = axios.isAxiosError(error) ? error.response?.status : undefined;
            const pending = !refreshCompleted && (!status || status >= 500);
            // Không có cookie hoặc phiên hết hạn là trạng thái chưa đăng nhập bình thường.
            stopSession(status === 401 ? '' : 'Chưa khôi phục được phiên đăng nhập.', pending);
          }
        });
      } catch {
        setLogoutError(uncertainMessage);
      } finally {
        setIsRestoring(false);
      }
    }
    void restoreSession();
  }, []);

  useEffect(() => {
    function checkSharedSession() {
      try {
        const state = readAuthState();
        if (currentSession.current && state?.version !== currentSession.current.version) {
          saveSession(null, '');
          setAccountError('Phiên đăng nhập đã thay đổi ở tab khác. Vui lòng đăng nhập lại.');
        }
        if (!currentSession.current) setLogoutError(state?.pending ? uncertainMessage : '');
      } catch {
        saveSession(null, '');
        setLogoutError('Không đọc được trạng thái phiên trong trình duyệt. Vui lòng kiểm tra quyền lưu trữ.');
      }
    }
    checkSharedSession();
    function onStorage(event: StorageEvent) {
      if (event.key === authStateKey || event.key === null) checkSharedSession();
    }
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    const version = currentSession.current?.version;
    async function loadCurrentUser() {
      try {
        const { data: body } = await getMeApi(accountApi);
        if (cancelled || loggingOut.current || !currentSession.current
          || currentSession.current.version !== version) return;
        const current = currentSession.current;
        saveSession({ ...current.data, user: body.data }, current.version);
      } catch {
        if (cancelled || loggingOut.current || !currentSession.current
          || currentSession.current.version !== version) return;
        setAccountError('Chưa cập nhật được thông tin tài khoản. Vui lòng thử lại sau.');
      }
    }
    void loadCurrentUser();
    return () => { cancelled = true; };
  }, [userId, accountApi]);

  return (
    <AuthContext.Provider value={{
      session,
      isRestoring,
      login,
      logout,
      isLoggingOut,
      logoutUnconfirmed,
      accountError,
      logoutError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
