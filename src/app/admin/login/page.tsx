'use client'

import { Signup } from '@/services/UserActionMap';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [state, setState] = useState(null);
    const [pending, setPending] = useState(false);
    const router = useRouter()
    const handleSubmit = async (event) => {
        event.preventDefault();
        setPending(true);
        const formData = new FormData(event.target);
        try {
            const result = await Signup(formData);
            console.log(result)
            setState(result);
            // 使用 router.push 进行路由跳转
            router.push('/admin/posts');
        } catch (error) {
            console.error('登录失败:', error);
        } finally {
            setPending(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
        >
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        登录账号
                    </h2>
                </motion.div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">邮箱</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="邮箱地址"
                            />
                            {state?.errors?.email && <p className="mt-1 text-sm text-red-600">{state.errors.email}</p>}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">密码</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="密码"
                            />
                            {state?.errors?.password && <p className="mt-1 text-sm text-red-600">{state.errors.password}</p>}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                                没有账号？立即注册
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={pending}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                            {pending ? '登录中...' : '登录'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
}