import { getAppEnvConfig } from '@/utils/env';
const { VITE_GLOB_API_URL } = getAppEnvConfig();

// 请求路径
export const baseURL = VITE_GLOB_API_URL;
// 超时事件
export const requestTimeout = 20000;
// 请求格式
export const contentType = 'application/json;charset=UTF-8';

// 图片服务器
export const QINIU_IMG_SERVER = 'https://img.altspicerver.com/';

// 返回code
export enum ResponseCode {
  SUCCESS = 200,
  ERROR = 422,
  BODYERROR = 400,
  UNAUTHORIZATION = 401,
  SERVERERROR = 500
}
// 返回信息格式
export interface ResponseJson<T = string> {
  code: ResponseCode;
  msg: string;
  data: T;
}

// 返回分页信息格式
export interface ResponsePageJson<T = any> {
  code: ResponseCode;
  msg: string;
  data: PageListJson<T> | null;
}

// 分页数据格式
export interface PageListJson<T> {
  list: T[];
  total: number;
}
