import { useEffect, useState, useRef, useCallback } from 'react';

// 配置
const RECONNECT_INTERVAL = 5000; // 断线重连间隔（5秒）
const MAX_RECONNECT_ATTEMPTS = 12; // 最大重连尝试次数（1分钟内重连，5秒一次，总共12次）
const PING_INTERVAL = 60000; // Ping-pong 保活机制，每分钟发送一次 ping

/**
 * 自定义 WebSocket Hook
 * @param initialUrl 初始 WebSocket 地址
 */
const useWebSocket = (initialUrl: string) => {
    const [isConnected, setIsConnected] = useState(false); // WebSocket 连接状态
    const [isManuallyClosed, setIsManuallyClosed] = useState(false); // 标记是否是手动关闭
    const [reconnectAttempts, setReconnectAttempts] = useState(0); // 重连尝试次数
    const socketRef = useRef<WebSocket | null>(null); // WebSocket 实例
    const pingPongTimerRef = useRef<NodeJS.Timeout | null>(null); // ping-pong 定时器
    const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null); // 重连定时器
    const callbacksRef = useRef<Map<string, Function[]>>(new Map()); // 存储回调函数
    const [messages, setMessages] = useState<string[]>([]);

    // 保持连接并管理 WebSocket 的状态
    const connect = useCallback((url: string) => {
        if (socketRef.current) {
            socketRef.current.close(); // 如果已有连接，先关闭它
        }

        // 创建 WebSocket 连接
        const socket = new WebSocket(url);
        socketRef.current = socket;

        socket.onopen = () => {
            setIsConnected(true);
            setReconnectAttempts(0); // 重置重连尝试次数
            setIsManuallyClosed(false); // 清除手动关闭标志
            console.log('WebSocket connection established');
            startPingPong(); // 启动 Ping-Pong 保活机制
        };

        socket.onmessage = (event) => {
            setMessages((prev) => [...prev, event.data]);
            handleIncomingMessage(event.data); // 处理服务器消息
        };

        socket.onclose = () => {
            setIsConnected(false);
            console.log('WebSocket connection closed');
            if (!isManuallyClosed && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
                attemptReconnect(url); // 如果不是手动关闭，且重连次数未达上限，尝试重连
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            socket.close(); // 错误时关闭连接
        };
    }, [isManuallyClosed, reconnectAttempts]);

    // 处理接收到的消息
    const handleIncomingMessage = (data: string) => {
        try {
            const parsedData = JSON.parse(data);
            const { type, payload } = parsedData;
            const callbacks = callbacksRef.current.get(type) || [];
            callbacks.forEach((callback) => callback(payload)); // 调用相应的回调函数
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    // 尝试重连
    const attemptReconnect = useCallback((url: string) => {
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            setReconnectAttempts((prev) => prev + 1); // 增加重连次数
            reconnectTimerRef.current = setTimeout(() => {
                connect(url); // 重新连接
            }, RECONNECT_INTERVAL);
        }
    }, [connect, reconnectAttempts]);

    // 启动 Ping-Pong 保活机制
    const startPingPong = useCallback(() => {
        pingPongTimerRef.current = setInterval(() => {
            if (socketRef.current && isConnected) {
                socketRef.current.send('ping'); // 发送 ping 保持连接活跃
                console.log('Sent ping');
            }
        }, PING_INTERVAL);
    }, [isConnected]);

    // 清除 Ping-Pong 定时器
    const stopPingPong = useCallback(() => {
        if (pingPongTimerRef.current) {
            clearInterval(pingPongTimerRef.current);
            pingPongTimerRef.current = null;
        }
    }, []);

    // 监听页面可见性变化，管理 WebSocket 连接
    const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
            if (!isConnected) {
                connect(initialUrl); // 页面重新可见时如果未连接，则尝试连接
            }
        } else {
            stopPingPong(); // 页面不可见时停止 Ping-Pong
            socketRef.current?.close(); // 页面不可见时断开连接
        }
    };

    // 监听 localStorage 变化
    const listenLocalStorage = useCallback(() => {
        window.addEventListener('storage', (e) => {
            if (e.key === 'websocket_message') {
                const { newValue } = e;
                if (newValue) {
                    handleIncomingMessage(newValue);
                }
            }
        });
    }, []);

    // 管理登录状态
    const setLogin = (url: string) => {
        connect(url); // 登录时连接 WebSocket
    };

    // 管理登出状态
    const setLogout = () => {
        setIsManuallyClosed(true); // 标记为手动关闭
        socketRef.current?.close(); // 断开连接
    };

    // 添加回调
    const addCallback = (type: string, callback: Function) => {
        if (!callbacksRef.current.has(type)) {
            callbacksRef.current.set(type, []);
        }
        callbacksRef.current.get(type)!.push(callback);
    };

    // 移除回调
    const removeCallback = (type: string, callback: Function) => {
        const callbacks = callbacksRef.current.get(type) || [];
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    };

    // 初始化和清理
    useEffect(() => {
        window.addEventListener('visibilitychange', handleVisibilityChange); // 监听页面可见性变化
        listenLocalStorage(); // 监听 localStorage

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            stopPingPong(); // 组件卸载时清除 Ping-Pong 定时器
            socketRef.current?.close(); // 组件卸载时断开连接
        };
    }, [handleVisibilityChange, stopPingPong, listenLocalStorage]);

    const sendMessage = (message: string) => {
        if (socketRef.current) {
            socketRef.current.send(message);
        }
    };

    return {
        isConnected,
        reconnectAttempts,
        setLogin,
        setLogout,
        addCallback,
        removeCallback,
        messages,
        sendMessage,
    };
};

export default useWebSocket;


/** @代码功能详解 **/
// 主动关闭与被动关闭：

// setManuallyClosed：标记 WebSocket 是否是手动关闭。当调用 setLogout 时，设置为 true，在断开连接后避免重连。
// 通过判断 socket.onclose 中的 isManuallyClosed 来决定是否进行重连。
// 断线重连：

// 当连接断开且不是手动关闭时，自动重连。最大重连尝试次数为 12 次（即 1 分钟内重连 12 次，每次重连间隔 5 秒）。
// Ping-Pong 保活机制：

// 每 1 分钟发送一个 ping 消息，保持连接的活跃状态。页面不可见时会停止 Ping-Pong。
// 监听 localStorage：

// 使用 storage 事件监听 localStorage，当其他页面更新时，接收到的消息会被传递给当前页面进行处理。
// 监听页面可见性变化：

// 监听页面的 visibilitychange 事件，当页面变为可见时，重新连接 WebSocket；当页面不可见时，断开连接并停止 Ping-Pong。




// import React, { useEffect } from 'react';
// import useWebSocket from './useWebSocket';

// const WebSocketComponent = () => {
//   const {
//     isConnected,
//     reconnectAttempts,
//     setLogin,
//     setLogout,
//     addCallback,
//     removeCallback,
//   } = useWebSocket(process.env.NEXT_PUBLIC_WS_DOMAIN + '/websocket/web');

//   useEffect(() => {
//     const handleWorkAward = (data: any) => {
//       console.log('Received work award:', data);
//     };

//     // 添加回调
//     addCallback('work_award', handleWorkAward);

//     return () => {
//       // 移除回调
//       removeCallback('work_award', handleWorkAward);
//     };
//   }, [addCallback, removeCallback]);

//   return (
//     <div>
//       <p>WebSocket Connected: {isConnected ? 'Yes' : 'No'}</p>
//       <button onClick={() => setLogin(process.env.NEXT_PUBLIC_WS_DOMAIN + '/websocket/web')}>
//         Connect WebSocket
//       </button>
//       <button onClick={() => setLogout()}>
//         Disconnect WebSocket
//       </button>
//     </div>
//   );
// };

// export default WebSocketComponent;
