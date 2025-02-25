import { NextApiRequest, NextApiResponse } from 'next';
import { WebSocketServer } from 'ws';

// 创建全局 WebSocket 服务器实例
const wss = new WebSocketServer({ noServer: true });

// 处理 WebSocket 连接
wss.on('connection', (ws) => {
  console.log('客户端已连接');

  // 处理收到的消息
  ws.on('message', (message) => {
    console.log('收到消息:', message.toString());
    // 回复客户端
    ws.send(`服务器收到: ${message}`);
  });

  // 处理客户端关闭连接
  ws.on('close', () => {
    console.log('客户端已断开连接');
  });
});

// Next.js API 路由处理函数
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // 仅支持 WebSocket 协议请求
  if (req.headers.upgrade !== 'websocket') {
    // 处理 HTTP 请求
    if (req.method === 'GET') {
      return res.status(200).send('WebSocket 端点。请通过 WebSocket 连接。');
    }
    return res.status(400).send('预期 WebSocket 连接');
  }

  // 处理 WebSocket 连接的升级
  if (req.socket) {
    req.socket.on('upgrade', (req, socket, head) => {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    });
  }

  // 返回空响应
  res.status(101).end();
}