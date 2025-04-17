import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from "next/font/google";
import '@/style/globals.scss';
import '@/lib/prisma';
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: 'Next博客',
  description: '创建Next.js 学习博客',
};
import I18nWrapper from '@/hoc/I18nWrapper';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased `}>
        <I18nWrapper>
          {children}
          {/* <BottomNav /> */}
        </I18nWrapper>
      </body>
    </html>
  );
}
