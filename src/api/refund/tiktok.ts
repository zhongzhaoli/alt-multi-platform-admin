import { SystemResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";

export enum OrderStatusEnum {
  "INITIATED" = "INITIATED",
  "CANCELLED" = "CANCELLED",
  "REFUNDED" = "REFUNDED",
}

export interface RefundTiktokProps {
  id: number;
  orderSn: string;
  shopName: string;
  orderStatus: OrderStatusEnum;
  productImageUrl: string;
  productName: string;
  orderLineQuantity: number;
  productSku: string;
  reason: string;
  orderAmount: number;
  name: string;
  requestDate: string;
}

export interface TiktokRefunFilterProps {
  shopId: string;
  orderSn: string;
  orderStatus: OrderStatusEnum;
  startDate: string;
  endDate: string;
}

export interface GetOrderDto extends Partial<TiktokRefunFilterProps> {
  page: number;
  pageSize?: number;
}

export function getTiktokRefundList(
  params: GetOrderDto,
): Promise<SystemResponsePageJson<RefundTiktokProps>> {
  return request({
    url: "/refund/tiktok/list",
    method: "get",
    params,
  });
}

// 取消订单
export function cancelOrder(orderSn: string): Promise<any> {
  return request({
    url: "/refund/tiktok/cancelOrder",
    method: "post",
    data: { orderSn },
  });
}

// 审核退款
export function reviewRefund(orderSn: string, review: boolean): Promise<any> {
  return request({
    url: "/refund/tiktok/refundReview",
    method: "post",
    data: { orderSn, review },
  });
}
