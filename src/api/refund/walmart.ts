import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface RefundWalmartProps {
  id: number;
  purchase_order_id: string;
  customer_order_id: string;
  shop_name: string;
  status: string;
  current_delivery_status: any;
  current_refund_status: any;
  total_refund_amount: number;
  customer_first_name: string;
  customer_last_name: string;
  return_order_date: string;
  product_image_url: string;
  product_name: string;
  sku: string;
}

export interface WalmartRefunFilterProps {
  shop_id: string;
  purchase_order_id: string;
  customer_order_id: string;
  start_date: string;
  endDate: string;
}

export interface GetOrderDto extends Partial<WalmartRefunFilterProps> {
  page: number;
  page_size?: number;
}

export function getWalmartRefundList(
  params: GetOrderDto
): Promise<ResponsePageJson<RefundWalmartProps>> {
  return request({
    url: '/returns/walmart/returns_orders',
    method: 'get',
    params: params
  });
}
