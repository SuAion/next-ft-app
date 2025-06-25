'use client'

import { baseStore } from "@/store/baseStore"
export default function CountList() {
  const setCount = baseStore(state => state.setCount)
  const count = baseStore(state => state.count)
  const setNumber = (num: number) => {
    setCount(num)
  }
  return (
    <ul>
      <button onClick={() => setNumber(count + 1)}>增加 </button>
      <li>{count}</li>
      <button onClick={() => setNumber(count - 1)}>减少</button>
    </ul>
  );
}
