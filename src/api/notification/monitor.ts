import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface MonitorNotificationProps {
  asin: string;
  created_at: string;
  id: number;
  message_id: string;
  pasin: string;
  platform: Array<'walmart' | 'tk'>;
  price: number | null;
  record_id: string;
  stock: number | null;
}

export interface FilterDto {
  pasin: string;
  asin: string;
  start_date: string;
  end_date: string;
}

export interface GetMonitorListDto extends Partial<FilterDto> {
  page: number;
  page_size?: number;
}

export function getMonitorNotificationList(
  params: GetMonitorListDto
): Promise<ResponsePageJson<any>> {
  return request({
    url: '/message/monitor/notify/list',
    method: 'get',
    params
  });
}
