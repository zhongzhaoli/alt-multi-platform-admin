import { mockURL, ResponseJson, ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

interface getDashboardDataDto {
  start_date: string;
  end_date: string;
  granularity: string;
}

export interface ListItemProps {
  desc: string;
  value: number;
  xText: string;
}

interface DashboardProps {
  list: ListItemProps[];
  history: ListItemProps[];
}
export function getDashboardData(
  params: getDashboardDataDto
): Promise<ResponseJson<DashboardProps>> {
  return request({
    baseURL: mockURL,
    url: '/dashboard/data',
    method: 'get',
    params
  });
}

interface GetSkuDataDto {
  page: number;
  page_size: number;
}
export interface SkuDataProps {}
export function getSkuData(params: GetSkuDataDto): Promise<ResponsePageJson<SkuDataProps>> {
  return request({
    baseURL: mockURL,
    url: '/dashboard/sku',
    method: 'get',
    params
  });
}
