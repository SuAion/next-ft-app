import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// 定义基础配置
const DEFAULT_TIMEOUT = 10000;
const BASE_URL = '/api';

// 状态码映射
const STATUS_MAPPING: Record<number, string> = {
  400: '请求错误',
  401: '未授权，请重新登录',
  403: '拒绝访问',
  404: '请求的资源不存在',
  500: '服务器内部错误',
  502: '网关错误',
  503: '服务不可用',
  504: '网关超时',
};

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    // 在这里可以添加token等请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // 确保返回数据包含User接口定义的所有属性
    if (response.data && typeof response.data === 'object') {
      return {
        id: response.data.id || '',
        name: response.data.name || '',
        email: response.data.email || '',
        ...response.data,
      };
    }
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const message = STATUS_MAPPING[status] || `连接错误${status}`;
      console.error(`请求错误: ${message}`);
    } else if (error.request) {
      console.error('请求超时，请检查网络连接');
    } else {
      console.error('请求错误:', error.message);
    }
    return Promise.reject(error);
  },
);

export default service;
