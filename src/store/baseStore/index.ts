// src/store/baseStore.ts
import { create } from 'zustand';

interface Store {
    posts: Array<{ id: string; title: string }>;
    setPosts: (posts: Array<{ id: string; title: string }>) => void;
    count: number,
    setCount: (count: number) => void;
}

export const baseStore = create<Store>((set) => ({
    posts: [],
    setPosts: (posts) => {
        set({ posts })
    },
    count: 60,
    setCount: (count) => {
        set({ count })
    }
}));