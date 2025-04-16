import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/lib/prisma";
import BottomNav from "./ui-components/BottomNav";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next博客",
  description: "创建Next.js 学习博客",
};
import I18nWrapper from '@/HOC/I18nWrapper';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased `}
      >
        <I18nWrapper>
          {children}
          <BottomNav />
        </I18nWrapper>
      </body>
    </html>
  );
}
