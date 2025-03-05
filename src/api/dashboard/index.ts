import { ResponseJson } from '@/config/request';
import { request } from '@/utils/request';

export interface WalmartListingSummaryProps {
  download_products: number;
  shop_id: string;
  shop_name: string;
  upload_products: number;
  reupload_products: number;
}

export interface WalmartSevenDaysSummaryProps {
  date: string;
  download_products: number;
  upload_products: number;
}

export function getWalmartListingSummary(): Promise<ResponseJson<WalmartListingSummaryProps[]>> {
  return request({
    url: '/walmart/shop/products/summary',
    method: 'get'
  });
}

interface GetSeventSummary {
  start_date: string;
  end_date: string;
}
export function getWalmartSevenDaysSummary(
  params: GetSeventSummary
): Promise<ResponseJson<WalmartSevenDaysSummaryProps[]>> {
  return request({
    url: '/walmart/products/summary',
    method: 'get',
    params
  });
}
