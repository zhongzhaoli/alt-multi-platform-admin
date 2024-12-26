import { ResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";

export enum TiktokStausEnum {
  "ON_HOLD" = "ON_HOLD",
  "UNPAID" = "UNPAID",
  "AWAITING_SHIPMENT" = "AWAITING_SHIPMENT",
  "PARTIALLY_SHIPPING" = "PARTIALLY_SHIPPING",
  "AWAITING_COLLECTION" = "AWAITING_COLLECTION",
  "IN_TRANSIT" = "IN_TRANSIT",
  "DELIVERED" = "DELIVERED",
  "COMPLETED" = "COMPLETED",
  "CANCELLED" = "CANCELLED",
}

export interface TiktokOrderProps {
  id: number;
  shopName: string;
  orderSn: string;
  orderStatus: string;
  productImageUrl: string;
  productName: string;
  productSku: string;
  orderLineQuantity: number;
  asin: string;
  orderTime: string;
  updateTime: string;
  phone: string;
  address1: string;
  address2: string | null;
  name: string;
  city: string;
  state: string;
  remark: string;
  carrierName: string;
  trackingNumber: string;
  trackingURL: string;
  totalAmount: number;
  productAmount: number;
  shippingFee: number;
  taxFee: number;
}

export interface TiktokOrderFilterProps {
  shopId: string;
  orderSn: string;
  orderStatus: TiktokStausEnum;
}

export interface GetOrderDto extends Partial<TiktokOrderFilterProps> {
  page: number;
  pageSize?: number;
}

// 列表
export function getTiktokOrderList(
  params: GetOrderDto,
): Promise<ResponsePageJson<TiktokOrderProps>> {
  return request({
    url: "/order/tiktok/list",
    method: "get",
    params,
  });
}

// 发货
export interface DeliverProductsDto {
  orderSn: string;
  carrierName: string;
  trackingNumber: string;
}
export function deliverProducts(data: Array<DeliverProductsDto>): Promise<any> {
  return request({
    url: "/order/tiktok/deliver",
    method: "post",
    data,
  });
}
