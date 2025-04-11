'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function UserProfileCard() {
    return (
        <motion.div
            className="flex flex-col items-center p-6 backdrop-blur-xl bg-white/50 rounded-3xl shadow-xl border border-white/30"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="relative mb-4">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                </motion.div>
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full p-1.5 shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-1">Nini</h2>
            <p className="text-gray-600 mb-4">会员等级: <span className="font-medium bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">黄金会员</span></p>

            <div className="flex gap-6 w-full justify-center">
                <motion.div
                    className="text-center p-3 rounded-xl backdrop-blur-sm bg-white/30"
                    whileHover={{ scale: 1.05 }}
                >
                    <p className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-blue-600 bg-clip-text text-transparent">12</p>
                    <p className="text-gray-600 text-sm mt-1">订单</p>
                </motion.div>
                <motion.div
                    className="text-center p-3 rounded-xl backdrop-blur-sm bg-white/30"
                    whileHover={{ scale: 1.05 }}
                >
                    <p className="text-2xl font-bold bg-gradient-to-br from-purple-500 to-purple-600 bg-clip-text text-transparent">24</p>
                    <p className="text-gray-600 text-sm mt-1">收藏</p>
                </motion.div>
                <motion.div
                    className="text-center p-3 rounded-xl backdrop-blur-sm bg-white/30"
                    whileHover={{ scale: 1.05 }}
                >
                    <p className="text-2xl font-bold bg-gradient-to-br from-green-500 to-green-600 bg-clip-text text-transparent">8</p>
                    <p className="text-gray-600 text-sm mt-1">优惠券</p>
                </motion.div>
            </div>
        </motion.div>
    )
}