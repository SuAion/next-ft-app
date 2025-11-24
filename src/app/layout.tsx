import type { Metadata } from 'next';
import { Poppins, Noto_Sans_JP } from 'next/font/google';
import '@/style/globals.scss';
import '@/lib/prisma';
import Image from 'next/image';

/** @使用next/font/google设置字体 */
// const poppins = Poppins({
//   weight: ['300', '400', '500', '600', '700'],
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-poppins', // 修复：使用正确的变量名
// });
// const notoSansJp = Noto_Sans_JP({
//   weight: ['300', '400', '500', '600', '700'],
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-noto-sans-jp', // 修复：使用更清晰的变量名
// });
{/* <body suppressHydrationWarning={true} className={`${poppins.variable} ${notoSansJp.variable}`}> */ }

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
      <body suppressHydrationWarning={true}>
        <div className='Header'>
          <div className='Header-left'>
            <div className='Header-left-logo'>
              <Image src='/images/icon.png' alt='logo' width={100} height={100} />
            </div>
          </div>
          <div className='Header-right'></div>
        </div>
        <div id="root-container">
          <I18nWrapper>
            {children}
          </I18nWrapper>
        </div>
      </body>
    </html>
  );
}
