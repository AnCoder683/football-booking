import { useEffect, useRef, useState } from 'react';
import { isAxiosError } from 'axios';
import { api } from '../../lib/api';

type Court = {
  id: string;
  name: string;
  playersPerTeam: number;
  pricePerSlot: number;
  isActive: boolean;
  branch: { name: string; address: string };
};
type AvailableStart = { startAt: string; endAt: string };
type AvailabilityState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'success'; starts: AvailableStart[]; baseStarts: AvailableStart[] };

const time = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export default function CourtAvailability({ courtId }: { courtId: string }) {
  const panel = useRef<HTMLElement>(null);
  // Vietnam uses UTC+7 throughout the year; do not use the browser's local date.
  const today = new Date(Date.now() + 7 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const lastDate = new Date(Date.parse(`${today}T00:00:00Z`) + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [date, setDate] = useState(today);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [court, setCourt] = useState<Court | null>(null);
  const [state, setState] = useState<AvailabilityState>({ status: 'loading' });
  const [selected, setSelected] = useState<AvailableStart | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => { panel.current?.focus(); }, []);

  useEffect(() => {
    const controller = new AbortController();
    setState({ status: 'loading' });
    setSelected(null);
    setCourt(null);
    async function loadAvailability() {
      try {
        const { data: detail } = await api.get<{ data: Court }>(`/courts/${courtId}`, { signal: controller.signal });
        if (controller.signal.aborted) return;
        setCourt(detail.data);
        if (!detail.data.isActive) {
          setState({ status: 'error', message: 'Sân đã ngừng nhận lịch mới. Vui lòng chọn sân khác.' });
          return;
        }
        if (!date || date < today || date > lastDate) {
          setState({ status: 'error', message: 'Vui lòng chọn ngày từ hôm nay đến 7 ngày tới.' });
          return;
        }
        const availabilityRequest = api.get<{ data: { availableStarts: AvailableStart[] } }>(`/courts/${courtId}/availability`, {
          params: { date, durationMinutes }, signal: controller.signal,
        });
        const baseRequest = durationMinutes === 30 ? availabilityRequest
          : api.get<{ data: { availableStarts: AvailableStart[] } }>(`/courts/${courtId}/availability`, {
              params: { date, durationMinutes: 30 }, signal: controller.signal,
            });
        const [availability, base] = await Promise.all([availabilityRequest, baseRequest]);
        if (!controller.signal.aborted) setState({ status: 'success', starts: availability.data.data.availableStarts, baseStarts: base.data.data.availableStarts });
      } catch (error) {
        if (controller.signal.aborted) return;
        let message = 'Chưa tải được lịch sân. Vui lòng thử lại.';
        if (isAxiosError(error)) {
          if (error.response?.status === 404) message = 'Sân không còn tồn tại. Vui lòng chọn sân khác.';
          if (error.response?.status === 409) message = 'Sân đã ngừng nhận lịch mới. Vui lòng chọn sân khác.';
          if (error.response?.status === 400) message = 'Ngày hoặc thời lượng không hợp lệ. Vui lòng chọn lại.';
        }
        setState({ status: 'error', message });
      }
    }
    void loadAvailability();
    return () => controller.abort();
  }, [courtId, date, durationMinutes, attempt, today, lastDate]);

  return (
    <section ref={panel} tabIndex={-1} className="availability-panel" aria-labelledby="availability-title">
      <p className="eyebrow">LỊCH SÂN · GIỜ VIỆT NAM</p>
      <h2 id="availability-title">{court ? court.name : 'Giờ trống của sân'}</h2>
      {court && <p>{court.branch.name} · {court.branch.address} · Sân {court.playersPerTeam} · {money.format(court.pricePerSlot)} / 30 phút</p>}
      <div className="court-filters">
        <label htmlFor="availability-date">Ngày chơi
          <input id="availability-date" type="date" min={today} max={lastDate} value={date} onChange={(event) => {
            setDate(event.target.value);
            setSelected(null);
            setState({ status: 'loading' });
          }} />
        </label>
        <label htmlFor="availability-duration">Thời lượng
          <select id="availability-duration" value={durationMinutes} onChange={(event) => {
            setDurationMinutes(Number(event.target.value));
            setSelected(null);
            setState({ status: 'loading' });
          }}>
            {[30, 60, 90, 120].map((minutes) => <option key={minutes} value={minutes}>{minutes} phút</option>)}
          </select>
        </label>
        <button className="court-select" onClick={() => {
          setSelected(null);
          setState({ status: 'loading' });
          setAttempt((value) => value + 1);
        }}>Tải lại lịch</button>
      </div>
      <p>Giờ mở cửa 06:00–22:00. Chọn giờ bắt đầu; mỗi lựa chọn bao gồm toàn bộ thời lượng bạn chọn.</p>
      <div aria-busy={state.status === 'loading'}>
        {state.status === 'loading' && <p role="status">Đang tải lịch sân…</p>}
        {state.status === 'error' && <p role="alert">{state.message}</p>}
        {state.status === 'success' && <>
          {state.starts.length === 0 && <p role="status">Không còn giờ trống cho thời lượng này. Bạn có thể đổi ngày hoặc thời lượng.</p>}
          <p className="availability-note">Mỗi ô là 30 phút: nền trắng còn trống · đỏ đã có lịch · xanh đang chọn · xám đã qua. Ô trống chỉ chọn được khi đủ thời lượng liên tiếp.</p>
          <div className="slot-timeline" role="group" aria-label="Lịch sân theo ô 30 phút">
            {Array.from({ length: 32 }, (_, index) => {
              const startAt = new Date(Date.parse(`${date}T06:00:00+07:00`) + index * 30 * 60 * 1000).toISOString();
              const available = state.starts.find((start) => start.startAt === startAt);
              const past = Date.parse(startAt) <= Date.now();
              const occupied = !past && !state.baseStarts.some((start) => start.startAt === startAt);
              const isSelected = selected !== null && startAt >= selected.startAt && startAt < selected.endAt;
              const label = `${time.format(new Date(startAt))}${past ? ' — đã qua' : occupied ? ' — đã có lịch' : available ? ' — có thể bắt đầu' : ' — không đủ thời lượng liên tiếp'}`;
              return <button key={startAt} className={`time-option${past ? ' slot-past' : occupied ? ' slot-occupied' : ''}`} disabled={past || !available} aria-label={label} aria-pressed={isSelected} onClick={() => { if (available) setSelected(available); }}>
                {time.format(new Date(startAt))}
              </button>;
            })}
          </div>
        </>}
      </div>
      {selected && court && <div className="selection-summary" role="status">
        <h3>Khung giờ đã chọn · {court.name}</h3>
        <p>Ngày {date.split('-').reverse().join('/')} · {time.format(new Date(selected.startAt))}–{time.format(new Date(selected.endAt))} · {durationMinutes} phút</p>
        <p>Tổng giá dự kiến: <strong>{money.format(court.pricePerSlot * durationMinutes / 30)}</strong></p>
      </div>}
      <p className="availability-note">Lịch trống không giữ chỗ. Chức năng đặt sân sẽ được bổ sung sau.</p>
    </section>
  );
}
