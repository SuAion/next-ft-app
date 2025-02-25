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

        // 发送一条消息
        singleSocketClassInstance.sendMessage('Hello Server');

        // 添加回调函数，监听特定消息类型
        const handleMessage = (data: any) => {
            console.log('client Received message:', data);
        };
        singleSocketClassInstance.addCallback('message', handleMessage);

        // 在组件卸载时注销回调并断开连接
        return () => {
            singleSocketClassInstance.removeCallback('message', handleMessage);
            singleSocketClassInstance.setLogout();
        };
    }, []);


    const sendMessage = () => {
        if (singleSocketClassInstance.isConnected) {

            singleSocketClassInstance.sendMessage(JSON.stringify({
                type: 'message',
                data: input
            })); // 发送消息到服务器
            setInput(''); // 清空输入框
        }
    }

    return (
        <div>
            <h1>WebSocket 示例</h1>
            <div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={sendMessage} >发送</button>
            </div>
            <div>
                <h2>收到的消息:</h2>
                <ul>
                    {messages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
export default SocketInstanceCp;