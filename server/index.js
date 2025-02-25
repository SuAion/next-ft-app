// server.js
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const WebSocket = require('ws');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || '', true);
    handle(req, res, parsedUrl);
  });

  // 创建 WebSocket 服务器
  const wsServer = new WebSocket.Server({ noServer: true });

  wsServer.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('message', (message) => {
      console.log('Received:', message);
      socket.send(`Server received: ${ message }`);
    });

    socket.on('close', () => {
      console.log('Sever WebSocket connection closed');
    });
  });

  // 处理 WebSocket 升级请求
  server.on('upgrade', (req, socket, head) => {
    if (req.url === '/api/websocket') {
      wsServer.handleUpgrade(req, socket, head, (ws) => {
        wsServer.emit('connection', ws, req);
      });
    } else {
      socket.destroy(); // 销毁未匹配路径的套接字
    }
  });

  // 启动服务器
  server.listen(3001, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3001');
  });
});
