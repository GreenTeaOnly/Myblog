'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HeaderClient() {
  const [scrolled, setScrolled] = useState(false);
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      setShowTopBtn(y > 300); // 滾超過 300px 才顯示回頂端按鈕
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className={scrolled ? 'scrolled' : ''}>
        <nav>
          <Link href="/">首頁</Link>
          <Link href="/about">關於我們</Link>
          <Link href="/settings">設定</Link>
          <Link href="/register">註冊</Link>
        </nav>
      </header>

      {/* 回到頂端按鈕 */}
      {showTopBtn && (
        <button
          className="scroll-top-btn"
          onClick={scrollToTop}
          aria-label="回到頂端"
        >
          ↑
        </button>
      )}
    </>
  );
}
