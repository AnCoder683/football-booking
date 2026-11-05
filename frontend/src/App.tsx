import CourtsSection from './CourtsSection';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Đến nội dung chính</a>
      <header className="header page-width">
        <a className="brand" href="/" aria-label="Football Booking — trang chủ">
          <span className="brand-mark" aria-hidden="true">FB</span>
          <span>Football<span className="brand-light"> Booking</span></span>
        </a>
        <span className="preview-label">Bản xem trước</span>
      </header>

      <main id="main" className="page-width">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow">HẸN NHAU RA SÂN</p>
            <h1 id="hero-title">Trận đấu hay,<br />bắt đầu từ<br /><span>một sân phù hợp.</span></h1>
            <p className="hero-description">
              Cùng đồng đội tìm sân cho buổi bóng tiếp theo.
              Sân 5, sân 7 hay sân 11 — chọn theo cách bạn chơi.
            </p>
            <a className="primary-link" href="#courts">Khám phá sân <span aria-hidden="true">↗</span></a>
          </div>

          <div className="pitch-panel" aria-hidden="true">
            <span className="pitch-caption">THE BEAUTIFUL GAME</span>
            <svg className="pitch" viewBox="0 0 320 440" fill="none">
              <rect x="22" y="20" width="276" height="400" rx="2" />
              <path d="M22 220H298" />
              <circle cx="160" cy="220" r="42" />
              <circle cx="160" cy="220" r="3" fill="currentColor" stroke="none" />
              <path d="M80 20V90H240V20M120 20V48H200V20M80 420V350H240V420M120 420V392H200V420" />
              <path d="M129 90A42 42 0 0 0 191 90M129 350A42 42 0 0 1 191 350" />
              <circle cx="160" cy="70" r="2" fill="currentColor" />
              <circle cx="160" cy="370" r="2" fill="currentColor" />
            </svg>
            <span className="pitch-note">MỘT QUẢ BÓNG. CẢ MỘT NIỀM VUI.</span>
          </div>
        </section>

        <CourtsSection />
      </main>

      <footer className="footer page-width">
        <span>Football Booking</span>
        <span>Hẹn nhau trên sân.</span>
      </footer>
    </>
  );
}
