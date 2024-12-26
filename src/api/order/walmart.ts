import { ResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";
export enum WalmartStausEnum {
  "Created" = "Created",
  "Acknowledged" = "Acknowledged",
  "Shipped" = "Shipped",
  "Delivered" = "Delivered",
  "Cancelled" = "Cancelled",
  "Refund" = "Refund",
}

export interface WalmartOrderProps {
  id: number;
  shopName: string;
  purchaseOrderId: string;
  customerOrderId: string;
  orderStatus: WalmartStausEnum;
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
  city: string;
  state: string;
  carrierName: string;
  trackingNumber: string;
  trackingURL: string;
  totalAmount: number;
  productAmount: number;
  shippingFee: number;
  taxFee: number;
}

export interface WalmartOrderFilterProps {
  shopId: string;
  purchaseOrderId: string;
  customerOrderId: string;
  orderStatus: WalmartStausEnum;
}

export interface GetOrderDto extends Partial<WalmartOrderFilterProps> {
  page: number;
  pageSize?: number;
}

// 列表
export function getWalmartOrderList(
  params: GetOrderDto,
): Promise<ResponsePageJson<WalmartOrderProps>> {
  return request({
    url: "/order/walmart/list",
    method: "get",
    params,
  });
}

// 发货
export interface DeliverProductsDto {
  customerOrderId: string;
  purchaseOrderId: string;
  carrierName: string;
  trackingNumber: string;
}
export function deliverProducts(data: Array<DeliverProductsDto>): Promise<any> {
  return request({
    url: "/order/walmart/deliver",
    method: "post",
    data,
  });
}
