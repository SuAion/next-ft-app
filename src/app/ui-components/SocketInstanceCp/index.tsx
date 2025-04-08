'use client'
import React, { useEffect, useState } from 'react';

import singleSocketClassInstance from '@/utils/webSocketManager';
const SocketInstanceCp = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    useEffect(() => {
        // 初始化 WebSocketManager 实例
        // 登录时，连接 WebSocket
        singleSocketClassInstance.setLogin('ws://localhost:3001/api/websocket');

        // 添加回调函数，监听特定消息类型
        const handleMessage = (data: any) => {
            console.log('服务端发送的消息 注册的类型为message的回调:', data);
            setMessages((prevMessages) => [...prevMessages, data]);
        };
        singleSocketClassInstance.addCallback('message', handleMessage);

        // 在组件卸载时注销回调并断开连接
        return () => {
            singleSocketClassInstance.removeCallback('message', handleMessage);
            singleSocketClassInstance.setLogout();
        };
    }, []);


    const sendMessage = (e) => {
        if (singleSocketClassInstance.isConnected) {

            singleSocketClassInstance.sendMessage(JSON.stringify({
                type: 'message',
                data: e.target.value
            })); // 发送消息到服务器
            setInput(''); // 清空输入框
        }
    }
    return (
        <div className="flex flex-col justify-center items-center">
            <ul role="list" className="divide-y divide-gray-100 w-9/12">
                {messages.map(({ type, msg }, key) => {
                    const isUser = false;
                    return (
                        <li key={key} className={`flex justify-between gap-x-6 py-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`h-8 w-8 flex flex-col justify-center items-center rounded-full ${isUser ? 'bg-green-300' : 'bg-gray-200'}`}>{type.charAt(0)}</div>
                            <div className="min-w-0 flex-auto">
                                <p className={`text-sm font-semibold leading-6 text-gray-900 ${isUser ? 'text-right' : ''}`}>{msg}</p>
                            </div>
                        </li>
                    )
                })
                }
            </ul>
            <form onSubmit={(e) => sendMessage(e)} className="mt-6 flex max-w-md gap-x-4">
                <input
                    id="chat"
                    name="chat"
                    type="text"
                    required
                    value={input}
                    className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6 text-black"
                    placeholder="Chat with your friends"
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
export default SocketInstanceCp;