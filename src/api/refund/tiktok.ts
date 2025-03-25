import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';
import { CancelToken } from 'axios';

export type ReturnStatus =
  | 'RETURN_OR_REFUND_REQUEST_PENDING'
  | 'REFUND_OR_RETURN_REQUEST_REJECT'
  | 'AWAITING_BUYER_SHIP'
  | 'BUYER_SHIPPED_ITEM'
  | 'REJECT_RECEIVE_PACKAGE'
  | 'RETURN_OR_REFUND_REQUEST_SUCCESS'
  | 'RETURN_OR_REFUND_REQUEST_CANCEL'
  | 'RETURN_OR_REFUND_REQUEST_COMPLETE'
  | 'REPLACEMENT_REQUEST_PENDING'
  | 'REPLACEMENT_REQUEST_REJECT'
  | 'REPLACEMENT_REQUEST_REFUND_SUCCESS'
  | 'REPLACEMENT_REQUEST_CANCEL'
  | 'REPLACEMENT_REQUEST_COMPLETE'
  | 'AWAITING_BUYER_RESPONSE';

export type ReturnType = 'REFUND' | 'RETURN_AND_REFUND' | 'REPLACEMENT';

export type ShipmentType = 'PLATFORM' | 'BUYER_ARRANGE';

export type ReturnRole = 'BUYER' | 'SELLER' | 'OPERATOR' | 'SYSTEM';

export interface RefundTiktokProps {
  create_time: string;
  order_id: string;
  name: string;
  last_name: string;
  phone_number: string;
  order_line_item_id: string;
  img_url: string;
  product_name: string;
  refund_subtotal: number;
  return_id: string;
  return_provider_name: string;
  return_reason: string;
  return_reason_text: string;
  return_status: ReturnStatus;
  return_tracking_number: string | null;
  return_type: ReturnType;
  role: ReturnRole;
  seller_sku: string;
  shipment_type: ShipmentType;
  shop_id: string;
  shop_name: string;
  update_time: string;
}

export interface TiktokRefunFilterProps {
  shop_id: string;
  start_date: string;
  end_date: string;
  order_id: string;
  return_id: string;
}

export interface GetOrderDto extends Partial<TiktokRefunFilterProps> {
  page: number;
  page_size?: number;
}

export function getTiktokRefundList(
  params: GetOrderDto
): Promise<ResponsePageJson<RefundTiktokProps>> {
  return request({
    url: '/returns/tiktok/returns_orders',
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
