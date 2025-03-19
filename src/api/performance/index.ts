import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface GetListDto {
  page: number;
  page_size?: number;
  shop_id?: string;
}

export interface PerformanceProps {
  cancellations: number;
  id: number;
  on_time_delivery: number;
  refunds: number;
  seller_response: number;
  shop_id: string;
  shop_name: string;
  update_time: string;
  valid_tracking: number;
}

export function getPerformanceList(
  params: GetListDto
): Promise<ResponsePageJson<PerformanceProps>> {
  return request({
    url: '/performance/walmart/list',
    method: 'get',
    params
  });
}
