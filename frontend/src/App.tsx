import { Link, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import RegisterSection from './modules/auth/RegisterSection';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Đến nội dung chính</a>
      <header className="header page-width">
        <Link className="brand" to="/" aria-label="Football Booking — trang chủ">
          <span className="brand-mark" aria-hidden="true">FB</span>
          <span>Football<span className="brand-light"> Booking</span></span>
        </Link>
        <Link className="primary-link" to="/register">Đăng ký</Link>
      </header>

      <main id="main" className="page-width">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterSection />} />
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
