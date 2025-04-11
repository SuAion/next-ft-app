'use client'
import { useState } from 'react'

type Order = {
    id: string
    date: string
    status: 'completed' | 'processing' | 'cancelled'
    total: number
    items: number
}

export default function OrderHistory() {
    const [orders, setOrders] = useState<Order[]>([
        {
            id: '#ORD-2023-001',
            date: '2023-10-15',
            status: 'completed',
            total: 128.5,
            items: 3
        },
        {
            id: '#ORD-2023-002',
            date: '2023-10-10',
            status: 'processing',
            total: 89.99,
            items: 2
        },
        {
            id: '#ORD-2023-003',
            date: '2023-10-05',
            status: 'cancelled',
            total: 45.0,
            items: 1
        }
    ])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800'
            case 'processing': return 'bg-blue-100 text-blue-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="p-4 rounded-lg hover:bg-white/50 transition-colors duration-200">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-medium text-gray-900">{order.id}</p>
                            <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {order.status === 'completed' ? '已完成' :
                                order.status === 'processing' ? '处理中' : '已取消'}
                        </span>
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                        <p className="text-sm">{order.items} 件商品</p>
                        <p className="font-medium">¥{order.total.toFixed(2)}</p>
                    </div>
                </div>
            ))}
            <button className="w-full mt-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                查看全部订单
            </button>
        </div>
    )
}