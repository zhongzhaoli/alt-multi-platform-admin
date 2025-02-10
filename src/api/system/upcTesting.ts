import { ResponseJson, ResponsePageJson } from '@/config/request';
import { getAppEnvConfig } from '@/utils/env';
import { request } from '@/utils/request';
const { VITE_NODE_API_URL } = getAppEnvConfig();

export interface GetUpcTestingDto {
  page: number;
  page_size?: number;
}

export type UpcTestingStatus = 'SUCCESS' | 'ERROR' | 'RUNNING';
export interface UpcTestingProps {
  id: number;
  createTime: string;
  updateTime: string;
  userId: string;
  status: UpcTestingStatus;
  username: string;
  taskId: string;
}

export function getUpcTestingList(
  params: GetUpcTestingDto
): Promise<ResponsePageJson<UpcTestingProps>> {
  return request({
    baseURL: VITE_NODE_API_URL,
    url: '/upcTesting/list',
    method: 'get',
    params
  });
}

export function createUpcTesting(data: FormData): Promise<any> {
  return request({
    baseURL: VITE_NODE_API_URL,
    url: '/upcTesting/create',
    method: 'post',
    data
  });
}

export function getUpcTestingLogs(taskId: string): Promise<ResponseJson<string[]>> {
  return request({
    baseURL: VITE_NODE_API_URL,
    url: `/upcTesting/logs/${taskId}`,
    method: 'get',
    customServerErrorMessage: null
  });
}

export function getcanuseTotal(): Promise<ResponseJson<number>> {
  return request({
    baseURL: VITE_NODE_API_URL,
    url: '/upcTesting/canuseTotal',
    method: 'get'
  });
}
