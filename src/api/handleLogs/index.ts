import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface GetLogsDto {
  page: number;
  page_size?: number;
  username?: string;
}

export interface LogProps {
  id: number;
  ip: string;
  location: string;
  operation_name: string;
  operation_status: number;
  operation_time: string;
  request_method: string;
  request_path: string;
  response_code: number;
  user_name: string;
}

export function getLogList(params: GetLogsDto): Promise<ResponsePageJson<LogProps>> {
  return request({
    url: '/logs',
    method: 'get',
    params
  });
}
