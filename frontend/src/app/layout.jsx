'use client';
import { usePathname } from 'next/navigation';
import { paths } from '../paths';
import { AuthProvider } from '@/context/AuthContext';
import { RTLProvider } from '@/styles/theme';
import '../styles/global.css';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const current = Object.values(paths).find((p) => p.path === pathname);

  return (
    <html lang='ar' dir='rtl'>
      <head>
        <title>{current?.title || 'مصنع حمزاوي'}</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <meta
          name='description'
          content='نظام إدارة مصنع حمزاوي للصناعات المعدنية'
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <RTLProvider>
          <AuthProvider>{children}</AuthProvider>
        </RTLProvider>
      </body>
    </html>
  );
}
