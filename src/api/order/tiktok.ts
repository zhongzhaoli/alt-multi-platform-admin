import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';
import { CancelToken } from 'axios';

const deliverErrorCode: { [key in string]: string } = {
  '11028006': '这个追踪号码无法与任何承运商匹配，请检查追踪号码并重新上传。',
  '21001201': '系统进程错误，请稍后再试。',
  '21011001': '找不到包。如果错误持续存在，请联系平台寻求帮助。',
  '21011007': '包裹物品有售后请求，请先处理售后请求。',
  '21011022': '无效的跟踪号码或提供商ID。请再次检查并重新尝试。',
  '21011025': '重复的跟綜号码。',
  '21011046': '无法拆分已经合并订单的订单。',
  '21021010': '包裹物品有售后请求，请先处理售后请求。',
  '21022026': '无法购买运单，请稍后再试。',
  '21022030': '系统进程错误，请稍后再试。',
  '99999999': '内部系统超时错误。如果错误持续存在，请联系平台寻求帮助。'
};

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
  sku_id: string;
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
export function deliverProducts(data: DeliverProductsDto): Promise<any> {
  return request({
    url: '/tiktok/mark_package_as_shipped',
    method: 'post',
    data,
    customServerErrorMessage: (data: any) => {
      const code = data?.code;
      if (code && code in Object.keys(deliverErrorCode)) {
        return deliverErrorCode[code];
      }
      return '发货失败，请稍后再试';
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
