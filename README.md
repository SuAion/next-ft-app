## SSG与SSR NextJS 14 默认SSG。

```
当你 npm run build 后，再 npm run start，无论你刷新多少次浏览器，内容都是不变的，即使有 fetch 也不行, 显示的时间仍旧是不变的
```

### SSG：静态渲染，在服务端构建部署时，数据重新生效，产生的静态页面可以被分发、缓存到全世界各地

    收益：访问更快、减轻服务器压力、利于SEO
    场景：没有变化的数据、多页面共享的数据

```js
export const revalidate = 10; // 10秒 过期时间
// 注意：revalidate = 600 is 支持, but revalidate = 60 * 10 is 不支持

async function fetchProductData(productId) {
    const response = await fetch(`https://api.example.com/products/${productId}`);
    if (!response.ok) {
        throw new Error('网络错误');
    }
    const data = await response.json();
    return data;
}
- **用法**：设置 `revalidate` 为 30 秒，确保用户每 30 秒能看到最新的统计信息。
export async function getStaticProps() {
    const stats = await fetchStatistics();
    return {
        props: {
            stats,
        },
        revalidate: 30, // 每 30 秒重新验证数据
    };
}

```

## SSR：动态渲染，在服务端接收到每个用户请求时，重新请求数据，重新渲染页面

    收益：显示实时数据、特定用户的特定数据（用于区别对待）、可以获取到客户端请求的cookie和URL参数

1. 当你需要给SSG固定一个缓存生效时间，可以在页面文件顶部增加一行

```js
export const dynamic = 'force-dynamic';
```

## 一、React cache 函数也可以用于记忆数据请求

```

cache(fn) 将fn的执行结果缓存起来，再次调用时，可以从缓存中获取结果

对于配置项的数据，可以缓存起来，下次请求时，直接从缓存中获取数据
配置项加入参数 会基于配置项做缓存键来缓存

UserA- FN(A)  缓存键：A
UserB- FN(B)  缓存键：B
```

## generateStaticParams 生成静态页面

假设你有一个动态路由的页面 /products/[id]，你希望为每个产品生成一个静态页面。你可以使用 generateStaticParams 来实现。

```
// pages/products/[id].tsx

export async function generateStaticParams() {
    // 假设你有一个 API 可以获取所有产品的 ID
    const response = await fetch('https://api.example.com/products');
    const products = await response.json();

    // 为每个产品生成静态参数
    return products.map(product => ({
        id: product.id.toString(), // 确保 ID 是字符串
    }));
}

export async function getStaticProps({ params }) {
    const product = await fetchProductData(params.id);
    return {
        props: {
            product,
        },
    };
}

const ProductPage = ({ product }) => {
    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
        </div>
    );
};

export default ProductPage;

```

## 服务端组件和客户端组件的包含关系

服务器组件可以包含客户端组件，适合在服务器端获取数据并传递给客户端进行交互

```
  // 服务器组件
  export default function ServerComponent() {
      const data = fetchDataFromServer(); // 服务器端获取数据

      return (
          <div>
              <h1>服务器组件</h1>
              <ClientComponent data={data} /> {/* 嵌套客户端组件 */}
          </div>
      );
  }
```

## 客户端组件请求 跨域的限制

```
"use client"
import { useState, useEffect } from "react";
export default  function ClientSideCp() {
   const [number, setNumber] =useState(0)
   const [data, setData] = useState(null);


  // 网络请求  浏览器发出请求 同源政策
   useEffect(() => {
       fetch('https://api.vercel.app/blog')
           .then(response => response.json())
           .then(data => setData(data))
           .catch(error => console.error('Error fetching data:', error));
   }, []);


   // 本地请求自己得api   服务器发出请求 没有同源政策。 等同于代理
   useEffect(() => {
    fetch('api/blogs')
        .then(response => response.json())
        .then(data => setData(data))
        .catch(error => console.error('Error fetching data:', error));
    }, []);



    return (
      <ul>
        <button onClick={() => setNumber(number + 1)}>增加 </button>
        <li>{number}</li>
        <button onClick={() => setNumber(number - 1)}>减少</button>
        {data && data.map(item => <li key={item.id}>{item.title}</li>)}
      </ul>
    );

}

```

## Zustand水合问题

默认情况下 服务端组件只能拿到当时在store数据，渲染过程不会受到来自其他德store数据更新触发改变

在解决水合问题时，服务端组件获取或更改的 Zustand 状态，需要通过 props 传递到客户端，然后在客户端去更新 Zustand 的值。这是因为：

React 的水合过程：

服务端生成的 HTML 只是静态的内容。
在客户端水合过程中，React 会尝试与服务端生成的 HTML 对齐，初始化状态通常不会同步。
Zustand 的单例问题：

Zustand 在客户端运行时保持的是一个全局状态。
服务端更改的状态不会自动同步到客户端，客户端会以自己的 Zustand 初始化值为主。
通过 props 将服务端的 Zustand 状态传递到客户端，然后在客户端用这些 props 初始化客户端的 Zustand 状态，可以确保状态的一致性，并解决水合问题。
