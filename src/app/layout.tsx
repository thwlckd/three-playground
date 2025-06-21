import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { unstable_ViewTransition as ViewTransition } from 'react';

const moneygraphyFont = localFont({
  src: '../assets/Moneygraphy-Pixel.woff2',
  weight: 'normal',
  style: 'normal',
});

export const metadata: Metadata = {
  title: 'three portfolio',
  description: 'three portfolio',
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="ko">
      <body className={`${moneygraphyFont.className} h-full min-h-screen w-full max-w-screen antialiased`}>
        <ViewTransition>{children}</ViewTransition>
      </body>
    </html>
  );
};

export default RootLayout;
