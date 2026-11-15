import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import RegisterSection from './modules/auth/RegisterSection';
import LoginSection, { type LoginData } from './modules/auth/LoginSection';

export default function App() {
  // shortcut: reload clears the session; restore it when frontend refresh is implemented.
  const [session, setSession] = useState<LoginData | null>(null);
  const [accountError, setAccountError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  // shortcut: retry state lives in this tab; coordinate tabs/reloads before adding auto refresh.
  const [logoutError, setLogoutError] = useState('');
  const logoutUnconfirmed = !session && logoutError !== '';
  const accessToken = session?.accessToken;

  async function handleLogout() {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setLogoutError('');
    setAccountError('');

    try {
      const response = await axios.post('/api/auth/logout', undefined, {
        headers: { 'X-CSRF-Protection': '1' },
      });
      if (response.status !== 204) throw new Error('Unexpected logout response');
      setSession(null);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        setLogoutError('Không thể đăng xuất do yêu cầu bị từ chối. Vui lòng thử lại.');
      } else {
        setSession(null);
        setLogoutError('Đã dọn đăng nhập trên trang này, nhưng chưa xác nhận đăng xuất trên máy chủ. Vui lòng thử đăng xuất lại.');
      }
    } finally {
      setIsLoggingOut(false);
    }
  }

  useEffect(() => {
    if (!accessToken) return;
    let cancelled = false;
    setAccountError('');

    async function loadCurrentUser() {
      try {
        const { data: body } = await axios.get<{ data: LoginData['user'] }>('/api/auth/me', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (cancelled) return;
        setSession(current => current ? { ...current, user: body.data } : null);
      } catch (error) {
        if (cancelled) return;
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setSession(null);
          setAccountError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
        } else {
          setAccountError('Chưa cập nhật được thông tin tài khoản. Vui lòng thử lại sau.');
        }
      }
    }

    void loadCurrentUser();
    return () => { cancelled = true; };
  }, [accessToken]);

  return (
    <>
      <a className="skip-link" href="#main">Đến nội dung chính</a>
      <header className="header page-width">
        <Link className="brand" to="/" aria-label="Football Booking — trang chủ">
          <span className="brand-mark" aria-hidden="true">FB</span>
          <span>Football<span className="brand-light"> Booking</span></span>
        </Link>
        <nav className="auth-nav" aria-label="Tài khoản">
          {session ? (
            <>
              <span className="user-greeting">Chào, {session.user.name}</span>
              <button className="logout-button" type="button" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? 'Đang đăng xuất…' : 'Đăng xuất'}
              </button>
            </>
          ) : isLoggingOut ? <span role="status">Đang đăng xuất…</span> : !logoutUnconfirmed && (
            <>
              <Link to="/login">Đăng nhập</Link>
              <Link className="primary-link" to="/register">Đăng ký</Link>
            </>
          )}
        </nav>
      </header>

      <main id="main" className="page-width">
        {accountError && <p className="register-message register-error" role="alert">{accountError}</p>}
        {logoutError && (
          <div className="register-message register-error" role="alert">
            <p>{logoutError}</p>
            {!session && (
              <button className="logout-button" type="button" onClick={handleLogout} disabled={isLoggingOut}>
                {isLoggingOut ? 'Đang đăng xuất…' : 'Thử đăng xuất lại'}
              </button>
            )}
          </div>
        )}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterSection />} />
          <Route path="/login" element={
            session || isLoggingOut || logoutUnconfirmed
              ? <p>Vui lòng hoàn tất đăng xuất trước khi đăng nhập lại.</p>
              : <LoginSection onLogin={setSession} />
          } />
          <Route path="*" element={<p>Không tìm thấy trang. <Link to="/">Về trang chủ</Link></p>} />
        </Routes>
      </main>

      <footer className="footer page-width">
        <span>Football Booking</span>
        <span>Hẹn nhau trên sân.</span>
      </footer>
    </>
  );
}
