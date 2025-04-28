import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface FilterDto {
  shop_id: string;
  start_date: string;
  end_date: string;
  sort: string;
}

export interface GetTiktokLogsDto extends Partial<FilterDto> {
  page: number;
  page_size?: number;
}

export interface TiktokLogsProps {
  attribute_problems_quantity: number;
  category_id: string;
  category_name: string;
  category_problems_quantity: number;
  create_product_problems_quantity: number;
  created_date: string;
  image_problems_quantity: number;
  insufficient_quantity: 0 | 1;
  pasin_successes_quantity: number;
  publish_product_problems_quantity: number;
  quantity_is_empty: 0 | 1;
  shop_id: string;
  shop_name: string;
  submit_asin_quantity: number;
  submit_pasin_quantity: number;
}

export function getTiktokLogsList(
  params: GetTiktokLogsDto
): Promise<ResponsePageJson<TiktokLogsProps>> {
  return request({
    url: '/tiktok/products/log/list',
    method: 'get',
    params
  });
}
