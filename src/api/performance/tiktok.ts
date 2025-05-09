import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';
import { FilterDto } from '@/views/performance/tiktok/config';

export interface GetListDto extends Partial<FilterDto> {
  page: number;
  page_size?: number;
}

export interface TiktokHealthProps {
  shop_id: string;
  shop_name: string;
  score: number | null;
  status: string;
  available_1: 0 | 1;
}

export function getHealthList(params: GetListDto): Promise<ResponsePageJson<TiktokHealthProps>> {
  return request({
    url: '/tiktok/health/list',
    method: 'get',
    params
  });
}
