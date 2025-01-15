'use client'

import { Signup, fetchUsers, deleteUser, updateUser } from '@/app/actions/UserActionMap';
import { useEffect, useState } from 'react'

export default function SignupForm() {
  const [state, setState] = useState(null);
  const [pending, setPending] = useState(false);
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    const formData = new FormData(event.target);
    try {
      const result = await Signup(formData);
      setState(result);
      fetchUsersList();
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setPending(false);
    }
  }

  const fetchUsersList = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('获取用户列表失败:', error);
    }
  }

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      fetchUsersList();
    } catch (error) {
      console.error('删除用户失败:', error);
    }
  }

  const handleEdit = (user) => {
    setEditUser(user);
  }

  const handleUpdate = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      await updateUser(editUser.id, formData);
      fetchUsersList();
      setEditUser(null);
    } catch (error) {
      console.error('更新用户失败:', error);
    }
  }

  useEffect(() => {
    fetchUsersList();
  }, []);

  return (
    <div className="form w-600 flex flex-col p-4 bg-gray-100 rounded shadow-md">
      <h1 className="text-xl text-black font-bold mb-4">{editUser ? '更新用户' : '注册用户'}</h1>
      <form onSubmit={editUser ? handleUpdate : handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-black block text-sm font-medium">姓名</label>
          <input id="name" name="name" placeholder="姓名" defaultValue={editUser?.name} className="mt-1 p-2 border rounded w-full" />
        </div>
        {state?.errors?.name && <p className="text-red-500">{state.errors.name}</p>}

        <div>
          <label htmlFor="email" className="text-black block text-sm font-medium">邮箱</label>
          <input id="email" name="email" placeholder="邮箱" defaultValue={editUser?.email} className="mt-1 p-2 border rounded w-full" />
        </div>
        {state?.errors?.email && <p className="text-red-500">{state.errors.email}</p>}

        <div>
          <label htmlFor="password" className="text-black block text-sm font-medium">密码</label>
          <input id="password" name="password" type="password" className="mt-1 p-2 border rounded w-full" />
        </div>
        {state?.errors?.password && (
          <div>
            <p className="text-red-500">密码必须:</p>
            <ul className="list-disc list-inside text-red-500">
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
        <button disabled={pending} type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          {editUser ? '更新' : '注册'}
        </button>
      </form>

      <h2 className="text-lg font-semibold mt-6  text-black">用户列表</h2>
      <ul className="mt-2 space-y-2 border-b text-black" >
        {users.map(user => (
          <li key={user.id} className="flex justify-between items-center p-2 border-b">
            <span>{user.name} - {user.email} - {user.password}</span>
            <div>
              <button onClick={() => handleEdit(user)} className="text-blue-500 hover:underline">编辑</button>
              <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:underline ml-2">删除</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}