'use client';

import { FormEvent, useState } from 'react';

type ApiSuccess = {
  id: string;
  username: string;
  email: string;
  createdAt: string;
};

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<ApiSuccess | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(null);

    if (!form.username || !form.email || !form.password || !form.confirmPassword) {
      setError('請填寫所有欄位');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('密碼與確認密碼不一致');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // 400 驗證錯 / 409 已存在 / 500 伺服器錯
        if (data?.issues?.fieldErrors) {
          const firstIssue =
            Object.values<string[]>(data.issues.fieldErrors)[0]?.[0] ?? '表單驗證失敗';
          setError(firstIssue);
        } else {
          setError(data?.error ?? '註冊失敗');
        }
        return;
      }

      setSuccess(data as ApiSuccess);
      setForm({ username: '', email: '', password: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      setError('無法連線到伺服器');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ maxWidth: 420, margin: '0 auto' }}>
      <h1>註冊</h1>

      {error && <p style={{ color: 'tomato', marginBottom: '1rem' }}>{error}</p>}
      {success && (
        <p style={{ color: 'green', marginBottom: '1rem' }}>
          註冊成功！歡迎 {success.username}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          使用者名稱
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="如: cooldev"
            required
          />
        </label>

        <label>
          電子郵件
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
          />
        </label>

        <label>
          密碼
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="至少 8 碼，含大小寫與數字"
            required
          />
        </label>

        <label>
          確認密碼
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={submitting} style={{ width: '100%' }}>
          {submitting ? '送出中…' : '註冊'}
        </button>
      </form>
    </section>
  );
}
