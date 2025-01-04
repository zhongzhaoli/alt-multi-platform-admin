import { ResponsePageJson, walmartURL } from "@/config/request";
import { request } from "@/utils/request";
import { WalmartStausEnum } from "../order/walmart";

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
  purchase_order_id: string;
  customer_order_id: string;
  shop_name: string;
  order_line_status: OrderStatusEnum;
  image_url: string;
  product_name: string;
  product_sku: string;
  trackingStatus: TrackingStatusEnum;
  status_quantity_amount: number;
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
  page_size?: number;
}

export function getWalmartRefundList(
  params: GetOrderDto,
): Promise<ResponsePageJson<RefundWalmartProps>> {
  return request({
    baseURL: walmartURL,
    url: "/order/",
    method: "get",
    params: {
      ...params,
      status: JSON.stringify([WalmartStausEnum.Cancelled]),
    },
  });
}
