// 'use client'
// // pages/index.js
// import { useEffect, useState } from 'react';

// export default function SSE() {
//     const [messages, setMessages] = useState([]);
//     const [status, setStatus] = useState('disconnected');

//     useEffect(() => {
//         const eventSource = new EventSource('/api/stream');

//         // 监听连接打开事件
//         eventSource.onopen = () => {
//             setStatus('connected');
//             console.log('SSE connection opened');
//         };

//         // 监听 'message' 事件，接收普通数据
//         eventSource.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             setMessages((prevMessages) => [...prevMessages, data]);
//         };

//         // 监听自定义事件，例如 'init'
//         eventSource.addEventListener('init', (event) => {
//             const initData = JSON.parse(event.data);
//             console.log('Init event received:', initData);
//         });

//         // 监听错误事件，自动重连机制会生效
//         eventSource.onerror = () => {
//             setStatus('error');
//             console.error('Error occurred in SSE connection');
//         };

//         // 在组件卸载时关闭连接
//         return () => {
//             eventSource.close();
//             console.log('SSE connection closed');
//         };
//     }, []);

//     return (
//         <div>
//             <h1>Server-Sent Events (SSE) Demo</h1>
//             <p>Status: {status}</p>
//             <div>
//                 {messages.map((message, index) => (
//                     <div key={index}>
//                         <strong>ID: {message.id}</strong> - Time: {message.time}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }


'use client'
import { useEffect } from 'react';

export default function Home() {
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000/api/websocket'); // 替换为你的 WebSocket 服务器地址

        socket.onopen = () => {
            console.log('WebSocket connected');
            socket.send('Hello Server');
        };

        socket.onmessage = (event) => {
            console.log('Message from server: ', event.data);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error: ', error);
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        // 组件卸载时关闭 WebSocket 连接
        return () => {
            socket.close();
        };
    }, []);

    return (
        <div>
            <h1>Welcome to WebSocket with Next.js!</h1>
        </div>
    );
}
