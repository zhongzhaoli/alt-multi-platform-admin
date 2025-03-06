import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export enum OrderStatusEnum {
  '未处理' = '未处理',
  '开卡中' = '开卡中',
  '待绑定' = '待绑定',
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

export enum OrderFailResonEnum {
  '行为异常' = '行为异常',
  '其他' = '其他'
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
  creator_type: 'old' | 'new';
  total_amount: number;
  card_number: string;
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
  cvv: string;
  card_lifespan: string;
}
export interface HanderCardDto extends OrderHanderBaseDto, HandleCardProps {
  status: OrderStatusEnum.待绑定;
}
export interface BindAccountProps {
  card_email: string;
  email_pwd: string;
  card_phone: string;
}
export interface BindAccountDto extends OrderHanderBaseDto, BindAccountProps {
  status: OrderStatusEnum.处理中;
  card_number: string;
}
export interface HanderOldCardDto extends OrderHanderBaseDto {
  status: OrderStatusEnum.处理中;
}
export interface OrderInfoSuccessProps {
  status: OrderStatusEnum.成功;
  card_status: '存活' | '死亡';
  pay_amount: number;
  card_email: string;
  email_pwd: string;
  card_phone: string;
}
export interface OrderInfoSuccessDto extends OrderHanderBaseDto, OrderInfoSuccessProps {
  status: OrderStatusEnum.成功;
  card_number: string;
}
export interface OrderInfoFailProps {
  status: OrderStatusEnum.失败;
  card_status: '存活' | '死亡';
  fail_remark: OrderInconsistentResonEnum;
  pay_amount: number;
  card_email: string;
  email_pwd: string;
  card_phone: string;
}
export interface OrderInfoFailDto extends OrderHanderBaseDto, OrderInfoFailProps {
  status: OrderStatusEnum.失败;
  card_number: string;
}
export function orderHander(
  data:
    | OrderInconsistentDto
    | ApplyCreditCardDto
    | HanderCardDto
    | BindAccountDto
    | HanderOldCardDto
    | OrderInfoSuccessDto
    | OrderInfoFailDto
): Promise<any> {
  return request({
    url: '/card/purchaser/delivery/card/up',
    method: 'post',
    data
  });
}

export function orderHanderForHandleCard(data: FormData): Promise<any> {
  return request({
    url: '/card/purchaser/delivery/card/in',
    method: 'post',
    data
  });
}

export enum CardStatus {
  '使用中' = '使用中',
  '死亡' = '死亡',
  '存活' = '存活'
}
export interface GetCardInfoDto {
  page: number;
  page_size?: number;
  card_number?: string;
}
export interface CardInfoProps {
  id: number;
  card_number: string;
  card_email: string;
  email_pwd: string;
  card_phone: string;
  cvv: string;
  card_status: CardStatus;
  two_step_token: string;
  card_path: string;
  card_lifespan: string;
  two_step: string;
  last_operated_time: string;
}
export function getCardInfo(params: GetCardInfoDto): Promise<ResponsePageJson<CardInfoProps>> {
  return request({
    url: '/card/purchaser/delivery/card',
    method: 'get',
    params
  });
}
