// 'use client';
// import { createContext, useContext } from "react";
// import { createStore } from "zustand/vanilla";
// import { useStore } from "zustand";

// // 声明 Post 类型
// type Post = {
//     id: number; // 帖子的唯一标识符
//     title: string; // 帖子的标题
//     // 可以根据需要添加更多字段
// };

// interface Store {
//     isMobile: boolean;
//     posts: Post[];
//     setPosts: (posts: Post[]) => void;
//     money: number,
//     setMoney: (money: number) => void;
//     setIsMobile: (isMobile: boolean) => void;
// }

// export const createGlobalStore = () => {
//     createStore<Store>((set) => ({
//         isMobile: typeof window !== 'undefined' ? window.innerWidth < 750 : false, // 初始值为 false，根据需要修改为相应的初始值或 TOD
//         setIsMobile: (isMobile: boolean) => set({ isMobile }), // 添加类型标注
//         posts: [] as Post[], // 添加类型标注
//         money: 100 as number, // 添加类型标注
//         setPosts: (posts: Post[]) => set({ posts }), // 添加类型标注
//         setMoney: (money: number) => set({ money }), // 添加类型标注
//     }));
// }
// // 创建 Context
// const StoreContext = createContext(null);

// // Store Provider
// export const GlobalStoreProvider = ({ children, store }) => {
//     return (
//         <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
//     );
// };

// // 使用自定义 Hook
// export const useGlobalStore = (selector) => {
//     const store = useContext(StoreContext);
//     if (!store) throw new Error("useGlobalStore must be used within StoreProvider");
//     return useStore(store, selector);
// };

// // // 客户端直接使用

// // "use client";

// // import { useGlobalStore } from "@/store/GlobalStore";
// // export default function ClientSideCp() {
// //   const posts = useGlobalStore((state) => state.posts);
// //   const count = useGlobalStore((state) => state.count);

// //   return (
// //     <div>
// //       <h2>客户端渲染内容</h2>
// //       <p>博客数量：{count}</p>
// //       {posts.map((post) => (
// //         <div key={post.id}>{post.title}</div>
// //       ))}
// //     </div>
// //   );
// // }

'use client';
import { create } from 'zustand';

// 声明 Post 类型
type Post = {
  id: number; // 帖子的唯一标识符
  title: string; // 帖子的标题
  // 可以根据需要添加更多字段
};

interface Store {
  isMobile: boolean;
  posts: Post[];
  permissions: string[];
  setPosts: (posts: Post[]) => void;
  money: number;
  setMoney: (money: number) => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const globalStore = create<Store>((set) => ({
  isMobile: typeof window !== 'undefined' ? window.innerWidth < 750 : false,
  setIsMobile: (isMobile: boolean) => set((state) => ({ ...state, isMobile })),
  posts: [] as Post[],
  permissions: [] as string[],
  money: 100 as number,
  setPosts: (posts: Post[]) => set((state) => ({ ...state, posts })),
  setMoney: (money: number) => set((state) => ({ ...state, money })),
}));
