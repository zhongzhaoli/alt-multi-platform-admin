import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';
import { CancelToken } from 'axios';
export enum WalmartStausEnum {
  'Created' = 'Created',
  'Acknowledged' = 'Acknowledged',
  'Shipped' = 'Shipped',
  'Delivered' = 'Delivered',
  'Cancelled' = 'Cancelled',
  'Refund' = 'Refund'
}

export interface WalmartOrderProps {
  children: WalmartOrderItemProps[];
  customer_order_id: string;
  order_date: string;
  order_total: number;
  purchase_order_id: string;
  shop_id: string;
  shop_name: string;
  update_time: string;
  estimated_ship_date: string;
  carrier: string;
  phone: string;
  postal_address1: string;
  postal_address2: string | null;
  postal_city: string;
  postal_state: string;
  tracking_url: string;
  tracking_number: string;
}

export interface WalmartOrderItemProps {
  id: number;
  shop_name: string;
  shop_id: string;
  purchase_order_id: string;
  customer_order_id: string;
  order_line_status: WalmartStausEnum;
  product_image_url: string;
  product_name: string;
  product_sku: string;
  order_line_quantity_amount: number;
  asin: string;
  charge_amount: number;
  charge_amount_product: number;
  charge_amount_product_tax: number;
  charge_amount_shipping: number;
  charge_amount_shipping_tax: number;
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
  order_line_number: number;
  item_id: string;
  statusObject: {
    label: string;
    value: WalmartStausEnum;
    type: 'primary' | 'success' | 'info' | 'warning' | 'danger';
  } | null;
  totalTax: number;
}

export interface WalmartOrderFilterProps {
  shopId: string;
  purchase_order_id: string;
  customer_order_id: string;
  order_status: WalmartStausEnum;
}

export interface GetOrderDto extends Partial<WalmartOrderFilterProps> {
  page: number;
  page_size?: number;
  order?: string;
}

export interface OrderExportProps extends Partial<WalmartOrderFilterProps> {
  order?: string;
}

// 列表
export function getWalmartOrderList(
  params: GetOrderDto
): Promise<ResponsePageJson<WalmartOrderProps>> {
  return request({
    url: '/walmart/order/list',
    method: 'get',
    params
  });
}

// 发货
export interface DeliverProductsDto {
  seller_order_id: string;
  purchase_order_id: string;
  carrier: string;
  tracking_number: string;
  shop_id: string;
  children: Array<{
    order_line_number: string;
    order_line_quantity_amount: string;
  }>;
}
export function deliverProducts(data: Array<DeliverProductsDto>): Promise<any> {
  return request({
    url: '/walmart/order/shipping',
    method: 'post',
    data
  });
}

// 订单导出
export function orderExport(params: OrderExportProps, cancelToken: CancelToken): Promise<Blob> {
  return request({
    url: '/walmart/order/list/export',
    method: 'get',
    responseType: 'blob',
    timeout: 120000,
    params,
    cancelToken
  });
}
