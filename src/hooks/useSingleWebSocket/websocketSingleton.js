// websocketSingleton.js
let wsInstance = null; // 全局唯一的 WebSocket 实例
let callbacksMap = new Map(); // 全局事件回调映射
let reconnectAttempts = 0; // 重连次数
let isManuallyClosed = false; // 标记是否是手动关闭
const RECONNECT_INTERVAL = 5000; // 断线重连间隔（5秒）
const MAX_RECONNECT_ATTEMPTS = 12; // 最大重连尝试次数（1分钟内重连，5秒一次，总共12次）
const PING_INTERVAL = 30000; // Ping-pong 保活机制，每30秒发送一次 ping

// 初始化 WebSocket
const initializeWebSocket = (url) => {
    if (wsInstance) return wsInstance; // 如果已经存在实例，直接返回

    wsInstance = new WebSocket(url);

    // WebSocket 连接成功
    wsInstance.onopen = () => {
        console.log('WebSocket connection established');
        reconnectAttempts = 0; // 重置重连次数
        isManuallyClosed = false; // 清除手动关闭标志
        startPingPong(); // 启动 Ping-Pong 保活机制
    };

    // WebSocket 收到消息
    wsInstance.onmessage = (event) => {
        try {
            const parsedData = JSON.parse(event.data);
            const { type, payload } = parsedData;
            const callbacks = callbacksMap.get(type) || [];
            callbacks.forEach((callback) => callback(payload)); // 调用相应的回调函数
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    };

    // WebSocket 连接关闭
    wsInstance.onclose = () => {
        console.log('WebSocket connection closed');
        if (!isManuallyClosed && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
            reconnectAttempts += 1; // 增加重连次数
            console.log('=======>尝试重连中')
            setTimeout(() => initializeWebSocket(url), RECONNECT_INTERVAL); // 尝试重连
        }
    };

    // WebSocket 错误处理
    wsInstance.onerror = (error) => {
        console.error('WebSocket error:', error);
        wsInstance.close(); // 错误时关闭连接
    };

    return wsInstance;
};

// 启动 Ping-Pong 保活机制
const startPingPong = () => {
    setInterval(() => {
        if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
            wsInstance.send('ping'); // 发送 ping 保持连接活跃
            console.log('Sent ping');
        }
    }, PING_INTERVAL);
};

// 关闭 WebSocket
const closeWebSocket = () => {
    if (wsInstance) {
        isManuallyClosed = true; // 标记为手动关闭
        wsInstance.close();
        wsInstance = null;
    }
};

// 添加事件回调
const addCallback = (type, callback) => {
    if (!callbacksMap.has(type)) {
        callbacksMap.set(type, []);
    }
    callbacksMap.get(type).push(callback);
};

// 移除事件回调
const removeCallback = (type, callback) => {
    const callbacks = callbacksMap.get(type) || [];
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
        callbacks.splice(index, 1);
    }
};

// 获取当前重连次数
const getReconnectAttempts = () => reconnectAttempts;

// 获取当前连接状态
const getConnectionStatus = () => {
    if (!wsInstance) return 'disconnected';
    return wsInstance.readyState === WebSocket.OPEN ? 'connected' : 'disconnected';
};

// 发送消息
const sendMessage = (message) => {
    if (wsInstance && wsInstance.readyState === WebSocket.OPEN) {
        wsInstance.send(JSON.stringify(message));
    } else {
        console.error('WebSocket is not connected.');
    }
};

// 获取全局 callbacksMap
const getCallbacksMap = () => callbacksMap;

export {
    initializeWebSocket,
    closeWebSocket,
    addCallback,
    removeCallback,
    getReconnectAttempts,
    getConnectionStatus,
    sendMessage,
    getCallbacksMap,
};