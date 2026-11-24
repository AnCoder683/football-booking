import { Link, Outlet } from 'react-router';
import { useAuth } from '../modules/auth/useAuth';

export default function AppLayout() {
  const {
    session, isRestoring, logout, isLoggingOut, logoutUnconfirmed, accountError, logoutError,
  } = useAuth();

  return (
    <>
      <a className="skip-link" href="#main">Đến nội dung chính</a>
      <header className="header page-width">
        <Link className="brand" to="/" aria-label="Football Booking — trang chủ">
          <span className="brand-mark" aria-hidden="true">FB</span>
          <span>Football<span className="brand-light"> Booking</span></span>
        </Link>
        <nav className="auth-nav" aria-label="Tài khoản">
          {isRestoring ? <span role="status">Đang khôi phục phiên…</span> : session ? (
            <>
              <span className="user-greeting">Chào, {session.user.name}</span>
              <button className="logout-button" type="button" onClick={logout} disabled={isLoggingOut}>
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
            {!session && !isRestoring && (
              <button className="logout-button" type="button" onClick={logout} disabled={isLoggingOut}>
                {isLoggingOut ? 'Đang đăng xuất…' : 'Thử đăng xuất lại'}
              </button>
            )}
          </div>
        )}
        <Outlet />
      </main>

      <footer className="footer page-width">
        <span>Football Booking</span>
        <span>Hẹn nhau trên sân.</span>
      </footer>
    </>
  );
}
