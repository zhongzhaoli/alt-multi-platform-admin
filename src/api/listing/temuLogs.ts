import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface FilterDto {
  shop_id: string;
  start_date: string;
  end_date: string;
  sort: string;
}

export interface GetTemuLogsDto extends Partial<FilterDto> {
  page: number;
  page_size?: number;
}

export interface TemuLogsProps {
  date: string;
  id: number;
  push_fail_amount: number;
  push_success_amount: number;
  shop_id: string;
  shop_name: string;
}

export function getTemuLogsList(params: GetTemuLogsDto): Promise<ResponsePageJson<TemuLogsProps>> {
  return request({
    url: '/temu/log/push',
    method: 'get',
    params
  });
}
