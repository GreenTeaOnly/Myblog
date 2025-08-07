'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginClient() {
  const { status } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get('callbackUrl') || '/profile';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (status === 'authenticated') router.replace(callbackUrl);
  }, [status, router, callbackUrl]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    setLoading(true);

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (res?.ok) router.push(callbackUrl);
    else setErr('登入失敗，請檢查帳號或密碼');
  };

  return (
    <section style={{ maxWidth: 420, margin: '0 auto' }}>
      <h1>登入</h1>
      {err && <p style={{ color: 'tomato', marginBottom: '1rem' }}>{err}</p>}
      <form onSubmit={onSubmit}>
        <label>
          電子郵件
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          密碼
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <button type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? '登入中…' : '登入'}
        </button>
      </form>
    </section>
  );
}
