'use client'


import { signup } from '@/app/actions/auth'
import { useActionState, useEffect } from 'react'

export default function SignupForm() {
  const [state, action, pending] = useActionState(signup, undefined);

  const handleSubmit = (event) => {
    event.preventDefault(); // 阻止默认提交行为
    action(event); // 调用 action 进行提交
  }

  useEffect(() => {
    if (state) { // 检查 state 是否存在
      console.log('提交成功，返回结果:', state); // 处理返回的结果
      if (state?.name) {
        // 你可以在这里执行其他操作，比如重定向或显示成功消息
        alert(state.name)
      }
    }
  }, [state]); // 依赖于 state 的变化

  return (
    <div className="form  w-600 flex flex-col" >

      <form action={action}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" name="name" placeholder="Name" />
        </div>
        {state?.errors?.name && <p>{state.errors.name}</p>}

        <div>
          <label htmlFor="email">Email</label>
          <input id="email" name="email" placeholder="Email" />
        </div>
        {state?.errors?.email && <p>{state.errors.email}</p>}

        <div>
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" />
        </div>
        {state?.errors?.password && (
          <div>
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
        <button disabled={pending} type="submit">
          Sign Up
        </button>
      </form>
    </div>
  )
}