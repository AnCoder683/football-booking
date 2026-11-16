import { Link, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import RegisterSection from './modules/auth/RegisterSection';
import LoginSection from './modules/auth/LoginSection';
import { useAuth } from './modules/auth/useAuth';

export default function App() {
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
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterSection />} />
          <Route path="/login" element={
            isRestoring
              ? <p role="status">Đang khôi phục phiên…</p>
              : session || isLoggingOut || logoutUnconfirmed
              ? <p>Vui lòng hoàn tất đăng xuất trước khi đăng nhập lại.</p>
              : <LoginSection />
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
