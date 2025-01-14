import { ResponsePageJson, tiktokURL } from '@/config/request';
import { request } from '@/utils/request';
import { CancelToken } from 'axios';

export enum OrderStatusEnum {
  'INITIATED' = 'INITIATED',
  'CANCELLED' = 'CANCELLED',
  'REFUNDED' = 'REFUNDED'
}

export interface RefundTiktokProps {
  id: number;
  order_id: string;
  shop_name: string;
  shop_id: string;
  order_status: OrderStatusEnum;
  sku_image: string;
  product_name: string;
  sku_id: string;
  total_amount: number;
  name: string;
  order_create_time: string;
  update_time: string;
  seller_sku: string;
}

export interface TiktokRefunFilterProps {
  shop_id: string;
  order_id: string;
  order_status: string;
}

export interface GetOrderDto extends Partial<TiktokRefunFilterProps> {
  page: number;
  page_size?: number;
  export?: 1 | 0;
}

export function getTiktokRefundList(
  params: GetOrderDto
): Promise<ResponsePageJson<RefundTiktokProps>> {
  return request({
    baseURL: tiktokURL,
    url: '/tk/get_return_order',
    method: 'get',
    params
  });
}

// 取消订单
export function cancelOrder(orderSn: string): Promise<any> {
  return request({
    url: '/refund/tiktok/cancelOrder',
    method: 'post',
    data: { orderSn }
  });
}

// 导出
export function exportTiktokRefundOrderList(
  params: GetOrderDto,
  cancelToken: CancelToken
): Promise<any> {
  return request({
    baseURL: tiktokURL,
    url: '/tk/get_return_order',
    method: 'get',
    params,
    responseType: 'blob',
    cancelToken
  });
}

// 审核退款
export function reviewRefund(orderSn: string, review: boolean): Promise<any> {
  return request({
    url: '/refund/tiktok/refundReview',
    method: 'post',
    data: { orderSn, review }
  });
}
