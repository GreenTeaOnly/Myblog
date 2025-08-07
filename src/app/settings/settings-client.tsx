// src/app/settings/settings-client.tsx
'use client';

import { useTheme } from '../ThemeContext';
import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsClient() {
  const { theme, toggleTheme } = useTheme();
  const { status } = useSession();
  const router = useRouter();

  // 前端保護：若未登入，導回 /login（雙保護：SSR + Client）
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login');
  }, [status, router]);

  if (status === 'loading') return <p>驗證中…</p>;
  if (status === 'unauthenticated') return null;

  return (
    <section>
      <h1>設定頁面</h1>
      <button onClick={toggleTheme}>
        切換到 {theme === 'light' ? '深色模式' : '淺色模式'}
      </button>
      <hr />
      <button
        style={{ marginTop: '1rem', color: 'tomato' }}
        onClick={() => signOut({ callbackUrl: '/login' })}
      >
        登出
      </button>
    </section>
  );
}
