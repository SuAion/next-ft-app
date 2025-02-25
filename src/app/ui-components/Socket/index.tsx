'use client'
import { useEffect, useState } from 'react';

export default function Socket() {
    const [messages, setMessages] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [ws, setWs] = useState<WebSocket | null>(null);

    useEffect(() => {
        // 延迟创建 WebSocket 实例，确保组件挂载时连接
        const socket = new WebSocket('ws://localhost:3001/api/websocket');
        setWs(socket);

        socket.onopen = () => {
            console.log('已连接到 WebSocket 服务器');
        };

        socket.onmessage = (event) => {
            console.log('=======>event', event);
            // 收到服务器消息
            setMessages((prev) => [...prev, event.data]);
        };

        socket.onclose = () => {
            console.log('WebSocket 连接已关闭');
        };

        return () => {
            socket.close();
        };
    }, []);

    const sendMessage = () => {
        if (ws) {
            ws.send(input); // 发送消息到服务器
            setInput(''); // 清空输入框
        }
    };

    return (
        <div>
            <h1>WebSocket 示例</h1>
            <div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button onClick={sendMessage} disabled={!ws}>发送</button>
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
