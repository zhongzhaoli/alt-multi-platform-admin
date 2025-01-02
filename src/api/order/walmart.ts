import { ResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";
import { walmartURL } from "@/config/request";
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
  shop_name: string;
  shop_id: string;
  purchase_order_id: string;
  customer_order_id: string;
  order_line_status: WalmartStausEnum;
  image_url: string;
  product_name: string;
  product_sku: string;
  order_line_quantity_amount: number;
  asin: string;
  product_amount: number;
  product_tax_amount: string;
  shipping_tax_amount: number;
  taxAmount: number;
  fee_amount: number;
  fee_tax_amount: number;
  phone: string;
  postal_address1: string;
  postal_address2: string | null;
  postal_city: string;
  postal_state: string;
  order_date: string;
  carrier: string;
  tracking_url: string;
  tracking_number: string;
}

export interface WalmartOrderFilterProps {
  shopId: string;
  purchaseOrderId: string;
  customerOrderId: string;
  orderStatus: WalmartStausEnum;
}

export interface GetOrderDto extends Partial<WalmartOrderFilterProps> {
  page: number;
  page_size?: number;
}

// 列表
export function getWalmartOrderList(
  params: GetOrderDto,
): Promise<ResponsePageJson<WalmartOrderProps>> {
  return request({
    baseURL: walmartURL,
    url: "/order",
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
