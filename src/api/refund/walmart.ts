import { ResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";

export enum OrderStatusEnum {
  "INITIATED" = "INITIATED",
  "CANCELLED" = "CANCELLED",
  "REFUNDED" = "REFUNDED",
}

export enum TrackingStatusEnum {
  "INITIATED" = "INITIATED",
  "SHIPPING" = "SHIPPING",
  "RETURNED" = "RETURNED",
}

export interface RefundWalmartProps {
  id: number;
  purchaseOrderId: string;
  customerOrderId: string;
  shopName: string;
  orderStatus: OrderStatusEnum;
  productImageUrl: string;
  productName: string;
  productSku: string;
  trackingStatus: TrackingStatusEnum;
  orderLineQuantity: number;
  orderAmount: number;
  name: string;
  requestDate: string;
}

export interface WalmartRefunFilterProps {
  shopId: string;
  purchaseOrderId: string;
  customerOrderId: string;
  startDate: string;
  endDate: string;
}

export interface GetOrderDto extends Partial<WalmartRefunFilterProps> {
  page: number;
  pageSize?: number;
}

export function getWalmartRefundList(
  params: GetOrderDto,
): Promise<ResponsePageJson<RefundWalmartProps>> {
  return request({
    url: "/refund/walmart/list",
    method: "get",
    params,
  });
}
