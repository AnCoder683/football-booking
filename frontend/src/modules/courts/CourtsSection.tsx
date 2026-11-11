import { useEffect, useState } from 'react';
import axios from 'axios';

type Court = {
  id: string;
  name: string;
  playersPerTeam: number;
  pricePerSlot: number;
  isActive: boolean;
  branch: { id: string; name: string; address: string };
};
type CourtsResponse = {
  success: true;
  data: Court[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};
type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'success'; response: CourtsResponse };

const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export default function CourtsSection() {
  const [page, setPage] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });

    async function loadCourts() {
      try {
        const { data: response } = await axios.get<CourtsResponse>('/api/courts', {
          params: { page, limit: 10 },
          signal: controller.signal,
        });
        if (response?.success !== true || !Array.isArray(response.data) || !response.meta) {
          throw new Error('Unexpected response');
        }
        if (!controller.signal.aborted) setState({ status: 'success', response });
      } catch {
        if (!controller.signal.aborted) setState({ status: 'error' });
      }
    }

    void loadCourts();
    return () => controller.abort();
  }, [page, attempt]);

  return (
    <section id="courts" className="courts-section" aria-labelledby="courts-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">CHỌN SÂN CỦA BẠN</p>
          <h2 id="courts-title">Sẵn sàng cho trận tiếp theo</h2>
        </div>
        <span className="section-number">
          {state.status === 'success' ? `${state.response.meta.total} SÂN ĐANG HOẠT ĐỘNG` : 'DANH SÁCH SÂN'}
        </span>
      </div>

      <div aria-busy={state.status === 'loading'}>
        {state.status === 'loading' && <p className="empty-state" role="status">Đang tải danh sách sân…</p>}
        {state.status === 'error' && (
          <div className="empty-state">
            <div role="alert">
              <h3>Chưa tải được danh sách sân</h3>
              <p>Vui lòng thử lại sau ít phút.</p>
            </div>
            <button className="retry-button" onClick={() => setAttempt((value) => value + 1)}>Thử lại</button>
          </div>
        )}
        {state.status === 'success' && (
          <>
            {state.response.data.length === 0 ? (
              <div className="empty-state" role="status">
                <div>
                  <h3>Chưa có sân để hiển thị</h3>
                  <p>Vui lòng quay lại sau để xem danh sách sân.</p>
                </div>
              </div>
            ) : (
              <div className="court-grid">
                {state.response.data.map((court) => (
                  <article className="court-card" key={court.id}>
                    <div className="court-card-top">
                      <span className="court-type">SÂN {court.playersPerTeam}</span>
                      <span className="court-status">Đang hoạt động</span>
                    </div>
                    <h3>{court.name}</h3>
                    <p className="court-branch">{court.branch.name}</p>
                    <p className="court-address">{court.branch.address}</p>
                    <div className="court-price">
                      <strong>{money.format(court.pricePerSlot)}</strong><span> / 30 phút</span>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {state.response.meta.totalPages > 1 && (
              <nav className="pagination" aria-label="Phân trang danh sách sân">
                <button disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Trang trước</button>
                <span aria-live="polite">Trang {page} / {state.response.meta.totalPages}</span>
                <button disabled={page >= state.response.meta.totalPages} onClick={() => setPage((value) => value + 1)}>Trang sau</button>
              </nav>
            )}
          </>
        )}
      </div>
    </section>
  );
}
