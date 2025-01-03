import { ResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";
import { tiktokURL } from "@/config/request";
import { CancelToken } from "axios";

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
  order_id: string;
  sku_image: string;
  product_name: string;
  seller_sku: string;
  shop_id: string;
  shop_name: string;
  asin: string;
  order_status: TiktokStausEnum;
  total_amount: number;
  product_sale_price: number;
  shipping_fee: number;
  tax: number;
  order_create_time: string;
  update_time: string;
  buyer_name: string;
  buyer_full_address: string;
  buyer_phone_number: string;
  buyer_message: string;
  sku_id: string;
  tracking_number: string;
  shipping_provider_id: string;
  order_line_item_id: string;
}

export interface TiktokOrderFilterProps {
  shopId: string;
  order_id: string;
  order_status: TiktokStausEnum;
}

export interface GetOrderDto extends Partial<TiktokOrderFilterProps> {
  page: number;
  page_size?: number;
  export?: 1 | 0;
  sort?: string;
}

// 列表
export function getTiktokOrderList(
  params: GetOrderDto,
): Promise<ResponsePageJson<TiktokOrderProps>> {
  return request({
    baseURL: tiktokURL,
    url: "/tk/get_all_order",
    method: "get",
    params,
  });
}

// 导出
export function exportTiktokOrderList(
  params: GetOrderDto,
  cancelToken: CancelToken,
): Promise<any> {
  return request({
    baseURL: tiktokURL,
    url: "/tk/get_all_order",
    method: "get",
    params,
    responseType: "blob",
    cancelToken,
  });
}

// 发货
export interface DeliverProductsDto {
  order_id: string;
  shipping_provider_id: string;
  tracking_number: string;
  shop_id: string;
  order_line_item_ids: string[];
}
export function deliverProducts(data: Array<DeliverProductsDto>): Promise<any> {
  return request({
    baseURL: tiktokURL,
    url: "/tk/mark_package_as_shipped",
    method: "post",
    data,
  });
}

// 取消订单
export interface CancelOrderDto {
  order_id: string;
  skus: { sku_id: string; quantity: number }[];
  order_line_item_ids: string[];
  cancel_reason: string;
  shop_id: string;
}
export function cancelOrder(data: CancelOrderDto[]): Promise<any> {
  return request({
    baseURL: tiktokURL,
    url: "/tk/cancel_order",
    method: "post",
    data,
  });
}
