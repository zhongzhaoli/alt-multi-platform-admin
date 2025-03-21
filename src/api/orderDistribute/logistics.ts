import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';
import { CancelToken } from 'axios';

export interface GetLogisticsListDto {
  page: number;
  page_size?: number;
  ship_date?: string;
  delivery_date?: string;
  postal_code?: string;
}

export interface LogisticsProps {
  carrier: string;
  country: string;
  delivery_date: string;
  delivery_path: string;
  id: number;
  postal_code: string;
  ship_date: string;
  ship_path: string;
  status: string;
  tracking_number: string;
}

export function getLogisticsList(
  params: GetLogisticsListDto
): Promise<ResponsePageJson<LogisticsProps>> {
  return request({
    url: '/logistics/list',
    method: 'get',
    params
  });
}

export function getExcellentFile(cancelToken: CancelToken): Promise<Blob> {
  return request({
    url: '/logistics/optimal/excel',
    method: 'get',
    responseType: 'blob',
    timeout: 120000,
    cancelToken
  });
}
