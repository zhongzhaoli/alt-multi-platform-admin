import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';
import { CancelToken } from 'axios';

export enum TiktokStausEnum {
  'ON_HOLD' = 'ON_HOLD',
  'UNPAID' = 'UNPAID',
  'AWAITING_SHIPMENT' = 'AWAITING_SHIPMENT',
  'PARTIALLY_SHIPPING' = 'PARTIALLY_SHIPPING',
  'AWAITING_COLLECTION' = 'AWAITING_COLLECTION',
  'IN_TRANSIT' = 'IN_TRANSIT',
  'DELIVERED' = 'DELIVERED',
  'COMPLETED' = 'COMPLETED',
  'CANCELLED' = 'CANCELLED'
}

export interface TiktokOrderProps {
  status: TiktokStausEnum;
  address_detail: string;
  children: TiktokOrderItemProps[];
  order_date: string;
  order_id: string;
  shipping_fee: number;
  shop_id: string;
  tax: number;
  total_amount: number;
  tracking_number: string;
  shipping_provider_id: string;
  is_shipping: null | '已发货';
}

export interface TiktokOrderItemProps {
  asin: string;
  order_line_item_id: string;
  pasin: string;
  product_name: string;
  seller_sku: string;
  sku_image: string;
  order_line_quantity_amount: number;
  sale_price: number;
  item_tax: TaxItem[];
}

export interface TaxItem {
  tax_amount: string;
  tax_rate: string;
}

export interface TiktokOrderFilterProps {
  shopId: string;
  order_id: string;
  order_status: TiktokStausEnum;
  start_date: string;
  end_date: string;
}

export interface GetOrderDto extends Partial<TiktokOrderFilterProps> {
  page: number;
  page_size?: number;
  export?: 1 | 0;
  sort?: string;
}

// 列表
export function getTiktokOrderList(
  params: GetOrderDto
): Promise<ResponsePageJson<TiktokOrderProps>> {
  return request({
    url: '/tiktok/order/list',
    method: 'get',
    params
  });
}

// 导出
export function exportTiktokOrderList(params: GetOrderDto, cancelToken: CancelToken): Promise<any> {
  return request({
    url: '/tiktok/order/list/export',
    method: 'get',
    params,
    responseType: 'blob',
    cancelToken
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
interface DeliverProductsErrorResponseProps {
  code: number;
  data: {
    message: string;
  };
  request_id: string;
}
export function deliverProducts(data: DeliverProductsDto): Promise<any> {
  return request({
    url: '/tiktok/mark_package_as_shipped',
    method: 'post',
    data,
    customServerErrorMessage: (data: Partial<DeliverProductsErrorResponseProps>) => {
      if (data?.data?.message) {
        return data.data.message;
      } else {
        return '发货失败，请稍后再试';
      }
    }
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
    url: '/tk/cancel_order',
    method: 'post',
    data
  });
}
