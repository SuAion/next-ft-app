'use client';

import { RegisUser, fetchUsers, deleteUser, updateUser } from '@/service/userActionMap';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

// 用户角色徽章组件
const RoleBadge = ({ isAdmin }) => (
  <span
    className={`px-2 py-1 text-xs rounded-full ${isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}
  >
    {isAdmin ? '管理员' : '普通用户'}
  </span>
);

// 编辑图标
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

// 删除图标
const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

// 添加用户图标
const AddUserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="8.5" cy="7" r="4"></circle>
    <line x1="20" y1="8" x2="20" y2="14"></line>
    <line x1="23" y1="11" x2="17" y2="11"></line>
  </svg>
);

export default function UsersManagementPage() {
  const [state, setState] = useState(null);
  const [pending, setPending] = useState(false);
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const { i18n } = useTranslation();
  console.log('=======>i18n', i18n);

  const changeLanguage = (lng) => {
    console.log('=======>lng', lng);
    i18n.changeLanguage(lng);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPending(true);
    const formData = new FormData(event.target);
    try {
      const result = await RegisUser(formData);
      setState(result);
      fetchUsersList();
    } catch (error) {
      console.error('提交失败:', error);
    } finally {
      setPending(false);
    }
  };

  const fetchUsersList = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error('获取用户列表失败:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      fetchUsersList();
    } catch (error) {
      console.error('删除用户失败:', error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
  };

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
  };

  useEffect(() => {
    fetchUsersList();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">用户管理</h1>
        <div className="flex items-center gap-4">
          <div className="flex space-x-2 bg-white rounded-md shadow-sm p-1">
            <button className="px-3 py-1 rounded-md text-sm hover:bg-gray-100" onClick={() => changeLanguage('zh')}>
              中文
            </button>
            <button className="px-3 py-1 rounded-md text-sm hover:bg-gray-100" onClick={() => changeLanguage('en')}>
              English
            </button>
          </div>
          <button
            onClick={() => setEditUser({})}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <AddUserIcon />
            <span>添加用户</span>
          </button>
        </div>
      </div>

      {/* 用户表单 */}
      {editUser && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">{editUser.id ? '更新用户' : '添加用户'}</h2>
          <form onSubmit={editUser ? handleUpdate : handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                姓名
              </label>
              <input
                id="name"
                name="name"
                placeholder="请输入姓名"
                defaultValue={editUser?.name}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {state?.errors?.name && <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                邮箱
              </label>
              <input
                id="email"
                name="email"
                placeholder="请输入邮箱"
                defaultValue={editUser?.email}
                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {state?.errors?.email && <p className="text-red-500 text-sm mt-1">{state.errors.email}</p>}

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                密码
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="请输入密码"
                className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {state?.errors?.password && (
              <div>
                <ul className="list-disc list-inside text-red-500 text-sm mt-1">
                  {state.errors.password.map((error) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                {pending ? '提交中...' : editUser.id ? '更新用户' : '添加用户'}
              </button>
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
              >
                取消
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 用户列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                用户信息
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                角色
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                注册时间
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td className="px-6 py-4 text-center text-gray-500">暂无用户数据</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name || '未设置姓名'}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleBadge isAdmin={user.isAdmin} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                      >
                        <EditIcon />
                        <span>编辑</span>
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="text-red-600 hover:text-red-900 flex items-center gap-1"
                      >
                        <DeleteIcon />
                        <span>删除</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
