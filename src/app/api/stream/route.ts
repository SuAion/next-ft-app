
// 流式传输
// https://developer.mozilla.org/docs/Web/API/ReadableStream#convert_async_iterator_to_stream


// function iteratorToStream(iterator: any) {
//   return new ReadableStream({
//     async pull(controller) {
//       const { value, done } = await iterator.next()

//       if (done) {
//         controller.close()
//       } else {
//         controller.enqueue(value)
//       }
//     },
//   })
// }

// function sleep(time: number) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, time)
//   })
// }

// const encoder = new TextEncoder()

// async function* makeIterator() {
//   yield encoder.encode('<p>One</p>')
//   await sleep(2000)
//   yield encoder.encode('<p>Two</p>')
//   await sleep(2000)
//   yield encoder.encode('<p>Three</p>')
// }

// export async function GET() {
//   const iterator = makeIterator()
//   const stream = iteratorToStream(iterator)

//   return new Response(stream)
// }








// 处理 SSE 请求的 API 路由
export async function GET(request) {

  // 检查请求头，确保是一个 SSE 连接
  // const acceptHeader = request.headers.get('Accept');
  // const cacheControlHeader = request.headers.get('Cache-Control');
  // const connectionHeader = request.headers.get('Connection');

  // // 验证请求头
  // if (!acceptHeader || !acceptHeader.includes('text/event-stream')) {
  //   return new Response('Invalid Accept header', { status: 400 });
  // }
  // if (cacheControlHeader && cacheControlHeader.includes('no-cache')) {
  //   return new Response('Invalid Cache-Control header', { status: 400 });
  // }
  // if (connectionHeader && connectionHeader !== 'keep-alive') {
  //   return new Response('Invalid Connection header', { status: 400 });
  // }
  // 检查请求头，确保是一个 SSE 连接
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  // 设置响应头
  writer.write(
    `:ok\n\n`, // 初始化连接
  );

  let id = 1;
  const interval = setInterval(() => {
    const data = {
      id: id,
      time: new Date().toLocaleTimeString(),
    };
    writer.write(`id: ${id}\n`);
    writer.write(`data: ${JSON.stringify(data)}\n\n`);
    id++;
  }, 2000);
  // 监听连接关闭事件
  request.signal.addEventListener('abort', () => {
    clearInterval(interval);
    writer.close();
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
