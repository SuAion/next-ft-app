import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';
import { ErrorCode } from './response';

/**
 * 后端返回签名 - 统一的API响应格式
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: ErrorCode;
    message: string;
    details?: any;
  };
  timestamp: string;
}

/**
 * 旧版本响应格式兼容
 */
export interface CommonResponse<T> {
  data: T;
  code: number;
  msg: string;
  headers?: any;
}

// 定义基础配置
const DEFAULT_TIMEOUT = 15000; // 增加超时时间
const BASE_URL = '/api';

/**
 * 扩展的请求配置
 */
export interface RequestConfig<T = any> extends AxiosRequestConfig {
  extra?: 'JSON' | 'DownLoadFile' | 'importFile';
  data?: T;
  skipAuth?: boolean; // 跳过认证
  retryCount?: number; // 重试次数
}

/**
 * 标准化的Promise响应类型
 */
export type AppResponse<T> = Promise<ApiResponse<T>>;

// 错误处理工具类
class RequestError extends Error {
  code: ErrorCode;
  status?: number;
  details?: any;

  constructor(message: string, code: ErrorCode, status?: number, details?: any) {
    super(message);
    this.name = 'RequestError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 支持 cookie
});

// 请求重试功能
const retryRequest = async (config: InternalAxiosRequestConfig, retryCount: number = 3): Promise<AxiosResponse> => {
  for (let i = 0; i < retryCount; i++) {
    try {
      return await service(config);
    } catch (error) {
      if (i === retryCount - 1) throw error;
      // 延迟重试
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('重试失败');
};

// 获取认证token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
  }
  return null;
};

// 清除认证信息
const clearAuth = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
  }
};

// 跳转登录页
const redirectToLogin = (): void => {
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    if (currentPath !== '/login' && currentPath !== '/loginAdmin') {
      clearAuth();
      window.location.href = currentPath.startsWith('/admin') ? '/loginAdmin' : '/login';
    }
  }
};

/** 改进的请求实例 */
const request = <T = any>(options: RequestConfig<T>): AppResponse<T> => {
  // 请求拦截器
  service.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 添加认证头
      if (!options.skipAuth) {
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // 设置请求头
      const METHOD_POST = ['post', 'put', 'patch'];
      if (METHOD_POST.includes(config.method!.toLowerCase())) {
        switch (options.extra) {
          case 'JSON':
            config.headers['Content-Type'] = 'application/json';
            break;
          case 'importFile':
            config.headers['Content-Type'] = 'multipart/form-data';
            break;
          default:
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
      }

      if (options.extra === 'DownLoadFile') {
        config.responseType = 'blob';
      }

      // 添加请求ID用于追踪
      config.headers['X-Request-ID'] = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return config;
    },
    (error) => {
      console.error('请求拦截器错误:', error);
      return Promise.reject(new RequestError('请求配置错误', ErrorCode.INTERNAL_ERROR));
    },
  );

  // 响应拦截器
  service.interceptors.response.use(
    async (response: AxiosResponse): Promise<AxiosResponse> => {
      // 处理token刷新
      const newToken = response.headers['authorization'] || response.headers['Authorization'];
      if (newToken && typeof window !== 'undefined') {
        const token = newToken.replace('Bearer ', '');
        sessionStorage.setItem('token', token);
      }

      const data = response.data;

      // 处理新格式响应
      if (typeof data === 'object' && 'success' in data) {
        if (!data.success) {
          const error = data.error || {};
          throw new RequestError(
            error.message || '请求失败',
            error.code || ErrorCode.INTERNAL_ERROR,
            response.status,
            error.details
          );
        }
        return response;
      }

      // 兼容旧格式响应
      if (typeof data === 'object' && 'code' in data) {
        const { code, msg } = data;
        switch (code) {
          case 200:
            return response;
          case 401:
            redirectToLogin();
            throw new RequestError(msg || '认证失败', ErrorCode.AUTHENTICATION_ERROR, 401);
          case 403:
            throw new RequestError(msg || '权限不足', ErrorCode.AUTHORIZATION_ERROR, 403);
          case 404:
            throw new RequestError(msg || '资源未找到', ErrorCode.NOT_FOUND, 404);
          default:
            throw new RequestError(msg || '请求失败', ErrorCode.INTERNAL_ERROR, code);
        }
      }

      return response;
    },
    async (error: AxiosError) => {
      console.error('响应拦截器错误:', error);

      // 网络错误处理
      if (!error.response) {
        if (error.code === 'ECONNABORTED') {
          throw new RequestError('请求超时，请稍后重试', ErrorCode.INTERNAL_ERROR);
        }
        throw new RequestError('网络连接失败，请检查网络', ErrorCode.INTERNAL_ERROR);
      }

      const { status, data } = error.response;

      // 处理不同HTTP状态码
      switch (status) {
        case 401:
          redirectToLogin();
          throw new RequestError('认证失败，请重新登录', ErrorCode.AUTHENTICATION_ERROR, 401);
        case 403:
          throw new RequestError('权限不足', ErrorCode.AUTHORIZATION_ERROR, 403);
        case 404:
          throw new RequestError('请求的资源不存在', ErrorCode.NOT_FOUND, 404);
        case 422:
          throw new RequestError('数据验证失败', ErrorCode.VALIDATION_ERROR, 422, data);
        case 429:
          throw new RequestError('请求过于频繁，请稍后重试', ErrorCode.INTERNAL_ERROR, 429);
        case 500:
          throw new RequestError('服务器内部错误', ErrorCode.INTERNAL_ERROR, 500);
        default:
          const errorMessage = (data as any)?.message || (data as any)?.msg || '请求失败';
          throw new RequestError(
            errorMessage,
            ErrorCode.INTERNAL_ERROR,
            status,
            data
          );
      }
    },
  );

  // 支持重试的请求
  if (options.retryCount && options.retryCount > 1) {
    return retryRequest({ ...service.defaults, ...options } as InternalAxiosRequestConfig, options.retryCount).then(
      (response) => response.data
    ) as AppResponse<T>;
  }

  return service(options).then((response) => ({
    ...response.data,
    headers: response.headers
  })) as AppResponse<T>;
};

export default request;
export { RequestError };
