import { useState, type FormEvent } from 'react';
import axios from 'axios';
import { Link } from 'react-router';

type RegisterResponse = {
  success: boolean;
  error?: { message: string; details?: { field: string; message: string }[] };
};

export default function RegisterSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;

    const form = event.currentTarget;
    const values = new FormData(form);
    const name = String(values.get('name'));
    const email = String(values.get('email'));
    const password = String(values.get('password'));
    setError('');
    setSuccess(false);

    // Count code points and UTF-8 bytes like the backend; never trim the password.
    if ([...password].length < 15 || new TextEncoder().encode(password).length > 72) {
      setError('Mật khẩu phải có ít nhất 15 ký tự và không vượt quá 72 byte UTF-8.');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: body } = await axios.post<RegisterResponse>('/api/auth/register', {
        name, email, password,
      });

      if (body?.success !== true) {
        setError(body?.error?.details?.map(issue => issue.message).join(' ')
          || body?.error?.message || 'Không thể đăng ký lúc này. Vui lòng thử lại sau.');
        return;
      }

      form.reset();
      setSuccess(true);
    } catch (error) {
      if (axios.isAxiosError<RegisterResponse>(error) && error.response) {
        const body = error.response.data;
        setError(body?.error?.details?.map(issue => issue.message).join(' ')
          || body?.error?.message || 'Không thể đăng ký lúc này. Vui lòng thử lại sau.');
      } else {
        setError('Chưa nhận được kết quả đăng ký. Vui lòng kiểm tra kết nối và thử lại sau.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="register" className="register-section" aria-labelledby="register-title">
      <div className="register-copy">
        <p className="eyebrow">THAM GIA CÙNG ĐỒNG ĐỘI</p>
        <h1 id="register-title">Tạo tài khoản của bạn</h1>
        <p>Đăng ký để chuẩn bị cho những trận bóng tiếp theo.</p>
        <p>Đã có tài khoản? <Link to="/login">Đăng nhập tại đây</Link>.</p>
      </div>

      <form className="register-form" onSubmit={handleSubmit} aria-busy={isSubmitting}>
        <fieldset disabled={isSubmitting}>
          <legend className="sr-only">Thông tin đăng ký</legend>
          <label htmlFor="register-name">Họ tên</label>
          <input id="register-name" name="name" autoComplete="name" required />

          <label htmlFor="register-email">Email</label>
          <input id="register-email" name="email" type="email" autoComplete="email" required />

          <label htmlFor="register-password">Mật khẩu</label>
          <input id="register-password" name="password" type="password" autoComplete="new-password" required />

          <button className="primary-link register-submit" type="submit">
            {isSubmitting ? 'Đang đăng ký…' : 'Đăng ký'}
          </button>
        </fieldset>
        {error && <p className="register-message register-error" role="alert">{error}</p>}
        {success && (
          <p className="register-message" role="status">
            Đăng ký thành công! <Link to="/login">Đăng nhập ngay</Link> để tiếp tục.
          </p>
        )}
      </form>
    </section>
  );
}
