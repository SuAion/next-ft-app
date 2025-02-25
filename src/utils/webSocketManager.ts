'use client'
const RECONNECT_INTERVAL = 5000; // 断线重连间隔（5秒）
const MAX_RECONNECT_ATTEMPTS = 12; // 最大重连尝试次数（1分钟内重连，5秒一次，总共12次）
const PING_INTERVAL = 60000; // Ping-pong 保活机制，每分钟发送一次 ping
const TAB_HIDDEN_LIVE = 1000 * 60; // 1分钟，页面不可见时的延迟关闭时间
const STORAGE_BUS_KEY = '_single_bus_storage'; // 用于监听的 localStorage 键名
const STORAGE_TIME_KEY = '_single_bus_storage_time'; // 用于监听的 localStorage 键名（存储最后访问时间）

interface StorageBusType {
  payload?: any;
  type?: string;
}

type TranslateFnType = (socketMsg?: string) => StorageBusType;

const defaultTranslateFn: TranslateFnType = socketMsg => {
  try {
    const socketData = JSON.parse(socketMsg || '{}');
    if (socketData.type) {
      return {
        type: socketData.type,
        payload: socketData.data,
      };
    }
  } catch (error) { }

  return {};
};



class WebSocketManager {
  private socket: WebSocket | null = null; // WebSocket实例
  isConnected: boolean = false; // WebSocket连接状态
  private reconnectAttempts: number = 0; // 连接重试次数
  private url: string = ''; // WebSocket连接地址
  private isManuallyClosed: boolean = false; // 是否是手动关闭
  private pingPongTimer: number | null = null; // Ping-pong定时器
  private reconnectTimer: number | null = null; // 断线重连定时器
  private callbackMap: Map<string, Function[]> = new Map(); // 回调函数映射
  private timer: number | null = null; // 页面不可见时的定时器
  private translateFn: TranslateFnType = defaultTranslateFn;
  private noneOtherConnected: boolean = true; // 是否没有其他页面连接

  constructor(url: string) {
    this.url = url;
    this.noneOtherConnected = !window.localStorage.getItem(STORAGE_BUS_KEY)
    this.listenStorage(); // 启动监听 localStorage
    this.listenTabVisibility(); // 启动监听页面可见性
    this.checkLocalStorageBusIsActive(); // 检查 localStorage 状态
  }

  // 检查localStorage中的WebSocket连接是否活跃
  private checkLocalStorageBusIsActive() {
    const time = window.localStorage.getItem(STORAGE_TIME_KEY);
    if (!time || (time && Date.now() - parseInt(time, 10) > 1000 * 60 * 2)) {
      // 超过2分钟未更新，可能是意料之外的关闭
      this.noneOtherConnected = true;
    }
  }

  // 监听 localStorage 事件
  private listenStorage() {
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_BUS_KEY) {
        const { newValue } = e;
        if (newValue) {
          // socket 传入了新数据
          this.noneOtherConnected = false;
          this.callCallback(this.translateFn(newValue));
        } else {
          // 另一个tab页的 socket 实际关闭
          this.noneOtherConnected = true;
          this.tryConnect();
        }
      }
    });
  }

  // 监听页面可见性变化
  private listenTabVisibility() {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        // 等待关闭中取消关闭
        if (this.timer) {
          window.clearTimeout(this.timer);
          this.timer = null;
        }
        this.tryConnect();
      } else {
        if (this.socket) {
          this.timer = window.setTimeout(() => {
            this.destroy();
          }, TAB_HIDDEN_LIVE);
        }
      }
    });
  }

  // WebSocket连接
  private connect() {
    if (this.socket) {
      this.socket.close(); // 如果已有连接，先关闭它
    }

    this.socket = new WebSocket(this.url);
    this.socket.onopen = () => this.onOpen();
    this.socket.onmessage = (event) => this.onMessage(event);
    this.socket.onclose = () => this.onClose();
    this.socket.onerror = (error) => this.onError(error);
  }

  // 连接成功后的处理
  private onOpen() {
    this.isConnected = true;
    this.reconnectAttempts = 0; // 重置重连次数
    this.isManuallyClosed = false; // 清除手动关闭标志
    console.log('WebSocket connected');
    this.startPingPong(); // 启动 Ping-pong 保活机制
  }

  // 处理接收到的消息
  private onMessage(event: MessageEvent) {
    const data = event.data;
    console.log('Received message:', data);
    //处理数据
    this.callCallback(this.translateFn(data));
  }

  // 连接关闭的处理
  private onClose() {
    this.isConnected = false;
    console.log('WebSocket connection closed');
    if (!this.isManuallyClosed && this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      this.attemptReconnect(); // 如果不是手动关闭，且重连次数未达上限，尝试重连
    }
  }

  // 连接错误的处理
  private onError(error: Event) {
    console.error('WebSocket error:', error);
    this.socket?.close(); // 错误时关闭连接
  }

  // 尝试重连
  private attemptReconnect() {
    if (this.reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      this.reconnectAttempts++;
      this.reconnectTimer = window.setTimeout(() => {
        this.connect(); // 重新连接
      }, RECONNECT_INTERVAL);
    }
  }

  // 启动 Ping-Pong 保活机制
  private startPingPong() {
    this.pingPongTimer = window.setInterval(() => {
      if (this.socket && this.isConnected) {
        this.socket.send('ping'); // 向服务器发送 ping
        console.log('Sent ping');
      }
    }, PING_INTERVAL);
  }

  // 停止 Ping-Pong 保活机制
  private stopPingPong() {
    if (this.pingPongTimer) {
      clearInterval(this.pingPongTimer);
      this.pingPongTimer = null;
    }
  }

  // 发送消息到 WebSocket
  sendMessage(message: string) {
    if (this.socket && this.isConnected) {
      this.socket.send(message); // 发送消息
      console.log('Sent message:', message);
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  // 添加回调
  addCallback(type: string, fn: Function) {
    if (!this.callbackMap.has(type)) {
      this.callbackMap.set(type, []);
    }
    this.callbackMap.get(type)?.push(fn);
  }

  // 移除回调
  removeCallback(type: string, fn: Function) {
    const fns = this.callbackMap.get(type);
    if (fns) {
      const index = fns.indexOf(fn);
      if (index !== -1) {
        fns.splice(index, 1);
      }
    }
  }

  // 调用回调函数
  private callCallback(data: StorageBusType) {
    try {
      const { type, payload } = data;
      if (this.callbackMap.has(type)) {
        this.callbackMap.get(type)?.forEach((fn) => fn(payload));
      }
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  }

  // 登录时调用，建立 WebSocket 连接
  setLogin(url: string) {
    this.url = url;
    this.connect();
  }

  // 登出时调用，断开 WebSocket 连接
  setLogout() {
    this.isManuallyClosed = true;
    this.socket?.close();
  }

  // 清理资源，关闭连接
  destroy() {
    this.stopPingPong();
    this.socket?.close();
    this.socket = null;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
  }

  // 尝试连接 WebSocket
  private tryConnect() {
    if (this.isConnected || this.socket) return; // 已连接或连接中，避免重复连接
    this.connect();
  }
}

/** @导出单例 **/
let url = process.env.NEXT_PUBLIC_WS_DOMAIN + '/websocket/web';
const singleWebSocket = new WebSocketManager(url);

// 导出 WebSocket 单例
export default singleWebSocket;

/** @多例使用 **/
// const webSocketManager = new WebSocketManager('ws://example.com/websocket');

// // 登录并建立连接
// webSocketManager.setLogin('ws://example.com/websocket');

// // 发送消息到服务器
// webSocketManager.sendMessage('Hello Server');

// // 监听特定类型的消息
// const callback = (data: any) => {
//   console.log('Received data:', data);
// };
// webSocketManager.addCallback('message_type', callback);

// // 在需要时注销并断开连接
// webSocketManager.setLogout();

// // 清理资源
// webSocketManager.destroy();



/** @单例react使用 **/
// import { useEffect } from 'react';

// const WebSocketComponent = () => {
//   useEffect(() => {
//     // 初始化 WebSocketManager 实例


//     // 登录时，连接 WebSocket
//     singleWebSocket.setLogin('ws://example.com/websocket');

//     // 发送一条消息
//     singleWebSocket.sendMessage('Hello Server');

//     // 添加回调函数，监听特定消息类型
//     const handleMessage = (data: any) => {
//       console.log('Received message:', data);
//     };
//     singleWebSocket.addCallback('message_type', handleMessage);

//     // 在组件卸载时注销回调并断开连接
//     return () => {
//       singleWebSocket.removeCallback('message_type', handleMessage);
//       singleWebSocket.setLogout();
//     };
//   }, []);

//   return <div>WebSocket Component</div>;
// };

