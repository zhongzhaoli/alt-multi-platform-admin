import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface GetSaleDashboardDto {
  page: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  platform?: string;
  msku?: string;
}

export interface SaleDashboardProps {
  product_sku: string;
  product_name: string;
  image_url: string;
  shop_name: string;
  total_quantity: number;
  total_pay_amount: number;
  total_shipping_amount: number;
  cancelled_quantity: number;
  pay_quantity: number;
  cancelled_proportion: number;
  buyer_number: number;
  total_tax: number;
}

export function getSaleDashboard(
  params: GetSaleDashboardDto
): Promise<ResponsePageJson<SaleDashboardProps>> {
  return request({
    url: '/sales/sales_show',
    method: 'get',
    params
  });
}
