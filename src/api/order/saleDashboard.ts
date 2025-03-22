import { ResponseJson } from '@/config/request';
import { request } from '@/utils/request';

export interface GetSaleDashboardDto {
  page: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  platform?: string;
  msku?: string;
  sort?: string;
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
  per_order_amount: number;
  pay_quantity: number;
  cancelled_proportion: number;
  buyer_number: number;
  total_tax: number;
}

export interface SaleDashboardSummaryProps {
  all_buyer_number: number;
  all_cancelled_proportion: number;
  all_cancelled_quantity: number;
  all_pay_amount: number;
  all_pay_quantity: number;
  all_product_tax: number;
  all_refund_proportion: number;
  all_refund_quantity: number;
  all_shipping_amount: number;
  all_shipping_tax: number;
  all_per_order_amount: number;
}

export function getSaleDashboard(params: GetSaleDashboardDto): Promise<
  ResponseJson<{
    total: number;
    list: SaleDashboardProps[];
    all_dict: SaleDashboardSummaryProps;
  }>
> {
  return request({
    url: '/sales/sales_show',
    method: 'get',
    params
  });
}
