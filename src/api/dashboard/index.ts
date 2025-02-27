import { ResponseJson } from '@/config/request';
import { request } from '@/utils/request';

export interface WalmartListingSummaryProps {
  download_products: number;
  shop_id: string;
  shop_name: string;
  upload_products: number;
}

export interface SkuDataProps {}
export function getWalmartListingSummary(): Promise<ResponseJson<WalmartListingSummaryProps[]>> {
  return request({
    url: '/walmart/products/summary',
    method: 'get'
  });
}
