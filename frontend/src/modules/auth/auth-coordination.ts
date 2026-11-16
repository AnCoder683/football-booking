export const authStateKey = 'football-booking-auth-state';

export type AuthState = {
  version: string; // Mã phiên để nhận ra request hoặc response của phiên cũ.
  pending: boolean; // Đang gửi thao tác auth, hoặc chưa xác định được kết quả.
};

export function readAuthState(): AuthState | null {
  const stored = localStorage.getItem(authStateKey);
  if (!stored) return null;
  const state: unknown = JSON.parse(stored);
  if (!state || typeof state !== 'object'
    || !('version' in state) || typeof state.version !== 'string'
    || !('pending' in state) || typeof state.pending !== 'boolean') {
    throw new Error('Không đọc được trạng thái phiên. Vui lòng kiểm tra dữ liệu trình duyệt.');
  }
  return { version: state.version, pending: state.pending };
}

export function writeAuthState(state: AuthState) {
  localStorage.setItem(authStateKey, JSON.stringify(state));
}

export async function withAuthLock(action: () => Promise<void>): Promise<void> {
  if (!navigator.locks) {
    throw new Error('Trình duyệt cần hỗ trợ Web Locks trên HTTPS hoặc localhost để xử lý đăng nhập an toàn.');
  }
  // Các tab dùng chung tên khóa nên phải chờ nhau thực hiện thao tác auth.
  return await navigator.locks.request('football-booking-auth', action);
}
