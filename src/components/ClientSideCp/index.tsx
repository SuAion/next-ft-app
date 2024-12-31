"use client"
import { useState, useEffect } from "react";
export default function ClientSideCp() {
  const [number, setNumber] = useState(0)
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
    <>
      <ul>
        <button onClick={() => setNumber(number + 1)}>增加 </button>
        <li>{number}</li>
        <button onClick={() => setNumber(number - 1)}>减少</button>
        {data && data.map(item => <li key={item.id}>{item.title}</li>)}
      </ul></>
  );

}
