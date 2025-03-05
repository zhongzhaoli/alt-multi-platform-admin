import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export enum OrderStatusEnum {
  '未处理' = '未处理',
  '开卡中' = '开卡中',
  '处理中' = '处理中',
  '成功' = '成功',
  '不符合条件' = '不符合条件',
  '失败' = '失败'
}

export enum OrderInconsistentResonEnum {
  '价格不符' = '价格不符',
  '配送时效不符' = '配送时效不符',
  '库存不符' = '库存不符',
  'Rating不符' = 'Rating不符'
}

export interface OrderItemProps {
  product_name: string;
  amount: number;
  image_url: string;
  number: number;
  sku: string;
}

export interface OrderProps {
  shop_name: string;
  shop_id: string;
  platform: string;
  platform_order_id: string;
  customer_order_id: string;
  total_amount: number;
  full_address: string;
  postal_code: string;
  postal_address_name: string;
  name: string;
  phone_number: string;
  status: OrderStatusEnum;
  children: OrderItemProps[];
}

export interface GetOrderDto {
  page: number;
  page_size?: number;
  role_id: string;
  status?: string;
  platform?: 'walmart' | 'tiktok';
  platform_order_id?: string;
  customer_order_id?: string;
}

export function getOrderList(params: GetOrderDto): Promise<ResponsePageJson<OrderProps>> {
  return request({
    url: '/card/purchaser/delivery/orders/list',
    method: 'get',
    params
  });
}

export interface OrderHanderBaseDto {
  shop_id: string;
  platform: string;
  platform_order_id: string;
  customer_order_id: string;
  status: OrderStatusEnum;
}
export interface OrderInconsistentDto extends OrderHanderBaseDto {
  status: OrderStatusEnum.不符合条件;
  fail_remark: OrderInconsistentResonEnum;
}
export interface ApplyCreditCardDto extends OrderHanderBaseDto {
  status: OrderStatusEnum.开卡中;
}
export interface HandleCardProps {
  card_number: string;
  card_email: string;
  email_pwd: string;
  card_phone: string;
  cvv: string;
  card_path: string;
  card_lifespan: string;
  img: File | null;
}
export interface HanderCardDto extends OrderHanderBaseDto, HandleCardProps {
  status: OrderStatusEnum.处理中;
}
export function orderHander(
  data: OrderInconsistentDto | ApplyCreditCardDto | HanderCardDto
): Promise<any> {
  return request({
    url: '/card/purchaser/delivery/card/up',
    method: 'post',
    data
  });
}

export function orderHanderForHandleCard(data: FormData): Promise<any> {
  return request({
    url: '/card/purchaser/delivery/card/up',
    method: 'post',
    data
  });
}
