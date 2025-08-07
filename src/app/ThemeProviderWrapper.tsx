'use client';

import { ReactNode, useEffect } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';

function LayoutWrapper({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
}

export default function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LayoutWrapper>{children}</LayoutWrapper>
    </ThemeProvider>
  );
}
