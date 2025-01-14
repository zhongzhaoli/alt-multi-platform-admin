import {
  baseURL,
  requestTimeout,
  contentType,
  ResponseCode,
  ResponseJson,
  ResponsePageJson
} from '@/config/request';
import { useUserStore } from '@/store/modules/user';
import { ElMessage } from 'element-plus';
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseHeaders,
  InternalAxiosRequestConfig,
  RawAxiosResponseHeaders
} from 'axios';
import { router } from '@/router';

export type ApiDataType = ResponseJson<any> | ResponsePageJson<any>;
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  customServerErrorMessage?: string | null;
}

interface CustomConfig extends InternalAxiosRequestConfig<any> {
  customServerErrorMessage?: string | null;
}
interface CustomResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: CustomConfig;
  request?: any;
}

function createService() {
  const instance = axios.create({
    baseURL,
    timeout: requestTimeout
  });
  axios.defaults.headers.post['Content-Type'] = contentType;
  // 请求拦截器
  const requestHandle = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const userStore = useUserStore();
    if (userStore.token) config.headers.Authorization = `${userStore.token}`;
    return config;
  };
  instance.interceptors.request.use(requestHandle, (error) => Promise.reject(error));

  // 响应拦截器
  const responseHandle = (response: CustomResponse) => {
    const userStore = useUserStore();
    // apiData 是 api 返回的数据
    const apiData = response.data;
    // 二进制数据则直接返回
    const responseType = response.request?.responseType;
    if (responseType === 'blob' || responseType === 'arraybuffer') return apiData;
    const code = apiData.code;
    switch (code) {
      case ResponseCode.SUCCESS:
        return apiData;
      case ResponseCode.BODYERROR:
        if (response.config.customServerErrorMessage !== null) {
          ElMessage.error(apiData.msg || response.config.customServerErrorMessage);
        }
        return Promise.reject(apiData);
      case ResponseCode.UNAUTHORIZATION:
        ElMessage.error('授权已失效，请重新登录');
        userStore.logout();
        router && router.push('/login');
        return Promise.reject(apiData);
      case ResponseCode.SERVERERROR:
        if (response.config.customServerErrorMessage !== null) {
          ElMessage.error(response.config.customServerErrorMessage || '服务器错误，请联系管理员');
        }
        return Promise.reject(apiData);
      default:
        // 其他情况
        return Promise.reject(apiData);
    }
  };
  instance.interceptors.response.use(
    (response) => responseHandle(response),
    (error: { code: string; config: CustomConfig; response?: AxiosResponse }) => {
      const userStore = useUserStore();
      // 服务器错误
      console.log('错误信息：', error);
      const code = error.code;
      if ((code && code === 'ERR_NETWORK') || code === 'ECONNABORTED') {
        if (error.config.customServerErrorMessage !== null) {
          ElMessage.error(error.config.customServerErrorMessage || '服务器错误，请联系管理员');
        }
      } else if (code && code === 'ERR_CANCELED') {
        ElMessage.warning('请求取消');
      } else if (code && code === 'ERR_BAD_REQUEST') {
        // 网络错误码
        const status = error.response!.status;
        switch (status) {
          case 404:
            router.push('/error');
            break;
          case 401:
            ElMessage.error('授权已失效，请重新登录');
            userStore.logout();
            router && router.push('/login');
            break;
          default:
            router.push('/error');
        }
      } else {
        return router.push('/error');
      }
      return Promise.reject(error);
    }
  );
  return instance;
}

function createRequest(service: AxiosInstance) {
  return function <T>(config: CustomAxiosRequestConfig): Promise<T> {
    return service(config);
  };
}

const service = createService();

export const request = createRequest(service);
