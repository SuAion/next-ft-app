import Link from 'next/link';
import { headers } from 'next/headers';

/** @自定义404组件 **/
export default async function NotFound() {
  const headersList = await headers();
  console.log('=======>headersList', headersList);
  const domain = headersList.get('host');

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fafafa] dark:bg-[#1a1a1a] px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tighter text-gray-900 dark:text-white">404</h1>
          <h2 className="text-xl font-medium text-gray-600 dark:text-gray-400">页面未找到</h2>
        </div>

        <p className="text-gray-500 dark:text-gray-400 text-base">抱歉，您请求的页面不存在或已被移除。</p>

        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black dark:bg-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors duration-200"
          >
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}
