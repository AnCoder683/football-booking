import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';

export type LoginData = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'CUSTOMER' | 'ADMIN';
    isBookingBlocked: boolean;
  };
};

type LoginResponse = {
  success: boolean;
  data?: LoginData;
  error?: { message: string; details?: { field: string; message: string }[] };
};

export default function LoginSection({ onLogin }: { onLogin: (data: LoginData) => void }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const values = new FormData(form);
    const email = String(values.get('email'));
    const password = String(values.get('password'));
    setError('');

    if (!password || new TextEncoder().encode(password).length > 72) {
      setError('Mật khẩu không được rỗng và không vượt quá 72 byte UTF-8.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: body } = await axios.post<LoginResponse>('/api/auth/login', {
        email, password,
      }, { headers: { 'X-CSRF-Protection': '1' } });

      if (body?.success !== true || !body.data) {
        setError(body?.error?.details?.map(issue => issue.message).join(' ')
          || body?.error?.message || 'Không thể đăng nhập lúc này. Vui lòng thử lại sau.');
        return;
      }

      form.reset();
      onLogin(body.data);
      navigate('/');
    } catch (error) {
      if (axios.isAxiosError<LoginResponse>(error) && error.response) {
        const body = error.response.data;
        setError(body?.error?.details?.map(issue => issue.message).join(' ')
          || body?.error?.message || 'Không thể đăng nhập lúc này. Vui lòng thử lại sau.');
      } else {
        setError('Chưa nhận được kết quả đăng nhập. Vui lòng kiểm tra kết nối trước khi thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="register-section" aria-labelledby="login-title">
      <div className="register-copy">
        <p className="eyebrow">SẴN SÀNG RA SÂN</p>
        <h1 id="login-title">Chào mừng bạn trở lại</h1>
        <p>Đăng nhập để tiếp tục cùng đồng đội.</p>
        <p>Chưa có tài khoản? <Link to="/register">Đăng ký tại đây</Link>.</p>
      </div>

      <form className="register-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
        <fieldset disabled={isSubmitting}>
          <legend className="sr-only">Thông tin đăng nhập</legend>
          <label htmlFor="login-email">Email</label>
          <input id="login-email" name="email" type="email" autoComplete="username" maxLength={254} required />

          <label htmlFor="login-password">Mật khẩu</label>
          <input id="login-password" name="password" type="password" autoComplete="current-password" required />

          <button className="primary-link register-submit" type="submit">
            {isSubmitting ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </button>
        </fieldset>
        {error && <p className="register-message register-error" role="alert">{error}</p>}
      </form>
    </section>
  );
}
