import { useEffect, useState } from 'react';
import {
    initializeWebSocket,
    closeWebSocket,
    addCallback,
    removeCallback,
    getReconnectAttempts,
    getConnectionStatus,
    sendMessage as sendMessageToServer,
    getCallbacksMap,
} from './websocketSingleton';

const useSingleWebSocket = () => {
    const [isConnected, setIsConnected] = useState(false); // 连接状态
    const [reconnectAttempts, setReconnectAttempts] = useState(0); // 重连次数
    const [url, setUrl] = useState(null); // 存储 WebSocket 地址

    // 初始化 WebSocket 连接
    const setLogin = async (url) => {
        if (typeof url === 'function') {
            url = await url(); // 如果传入的是异步函数，等待获取地址
        }
        setUrl(url); // 存储地址
        initializeWebSocket(url); // 初始化全局 WebSocket 实例

        // 监听连接状态变化
        const checkConnectionStatus = () => {
            console.log('=======>111', 111)
            console.log('=======>getReconnectAttempts()', getReconnectAttempts())
            setIsConnected(getConnectionStatus() === 'connected');
            setReconnectAttempts(getReconnectAttempts());
        };

        // 定期检查连接状态
        const interval = setInterval(checkConnectionStatus, 1000);

        // 清理定时器
        return () => clearInterval(interval);
    };

    // 登出时关闭 WebSocket
    const setLogout = () => {
        closeWebSocket();
        setIsConnected(false);
    };

    // 添加事件回调
    const registerCallback = (type, callback) => {
        addCallback(type, callback);

        // 返回清理函数
        return () => {
            removeCallback(type, callback);
        };
    };

    // 发送消息
    const sendMessage = (message) => {
        sendMessageToServer(message);
    };

    // 监听页面可见性变化
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !isConnected && url) {
                setLogin(url); // 页面重新可见时尝试重连
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isConnected, url]);

    // 监听 localStorage 变化
    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === 'websocket_message') {
                const message = JSON.parse(event.newValue);
                const callbacks = getCallbacksMap().get(message.type) || [];
                callbacks.forEach((callback) => callback(message.payload));
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return {
        isConnected,
        reconnectAttempts,
        setLogin,
        setLogout,
        registerCallback,
        sendMessage,
    };
};

export default useSingleWebSocket;