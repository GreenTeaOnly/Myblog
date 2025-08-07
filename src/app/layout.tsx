import './globals.css';
import HeaderClient from './HeaderClient';
import ThemeProviderWrapper from './ThemeProviderWrapper';
import SessionProviderWrapper from './SessionProviderWrapper';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant">
      <body>
        <SessionProviderWrapper>
          <ThemeProviderWrapper>
            <HeaderClient />
            <main style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
              {children}
            </main>
          </ThemeProviderWrapper>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
