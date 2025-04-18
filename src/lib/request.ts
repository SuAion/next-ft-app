import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios';

/**
 * 后端返回签名
 */
export interface CommonResponse<T> {
  data: T;
  code: number;
  msg: string;
  headers?: any; // 添加headers字段
}
// 定义基础配置
const DEFAULT_TIMEOUT = 10000;
const BASE_URL = '/api';
/**
 * axios请求参数上结合自身需要请求参数签名
 */
export interface RequestConfig<T = any> extends AxiosRequestConfig {
  extra?: string;
  data?: T;
}

/**
 * 实际promise应用实例带有标准返回格式的promise签名
 */
export type AppResponse<T> = Promise<CommonResponse<T>>;

// 创建axios实例
const service: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});
/** 请求实例 */
const request = <T = any>(options: RequestConfig<T>): AppResponse<any> => {
  service.interceptors.request.use(
    (request: InternalAxiosRequestConfig<T>) => {
      const token = sessionStorage.getItem('token') as string;
      if (token) {
        request.headers!.token = token;
      }

      const METHOD_POST = ['post', 'put', 'patch'];
      if (METHOD_POST.includes(request.method!.toLowerCase())) {
        if (options.extra === 'JSON') {
          request.headers['Content-Type'] = 'application/json';
        } else {
          request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
      }
      if (options.extra === 'DownLoadFile') {
        request.responseType = 'blob';
      }
      if (options.extra === 'importFile') {
        request.headers['Content-Type'] = 'multipart/form-data';
      }
      return request;
    },
    (err) => {
      Promise.reject(err).then();
    },
  );

  service.interceptors.response.use(
    async (response: AxiosResponse<any>): Promise<AxiosResponse<any>> => {
      if (response.headers!.fresh_token) {
        sessionStorage.token = response.headers!.fresh_token;
      }
      const { msg, code } = response.data;
      switch (code) {
        case 200:
          response;
        case 400: // 登录失效
          sessionStorage.removeItem('token');
          window.location.href = '/login';
          return response;
        default:
          return response;
      }
    },
    (err: AxiosError) => {
      return Promise.reject(err);
    },
  );

  return service(options);
};

export default request;
