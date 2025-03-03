import { ResponseJson, ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

interface GetDistributeUserDto {
  page: number;
  page_size?: number;
  user_name?: string;
  role_name?: string;
}

export interface DistributeUserProps {
  user_id: string;
  username: string;
  workwx_user_id: string;
  role_id: string;
  role_name: string;
}

export function getDistributeUserList(
  params: GetDistributeUserDto
): Promise<ResponsePageJson<DistributeUserProps>> {
  return request({
    url: '/card/purchaser/user/list',
    method: 'get',
    params
  });
}

export interface GetDeliveryOrderDto {
  page: number;
  page_size?: number;
  role_name?: string;
  role_id?: string;
  price_type?: '>70' | '<=70';
  status?: 'fail' | 'new';
}
export interface DeliveryOrderProps {
  shop_id: string;
  shop_name: string;
  platform_order_id: string;
  customer_order_id: string;
  platform: 'walmart' | 'tiktok';
  total_product_amount: number;
  buyer_full_address: string;
}

export function getDeliveryOrder(
  params: GetDeliveryOrderDto
): Promise<ResponsePageJson<DeliveryOrderProps>> {
  return request({
    url: '/card/purchaser/delivery/orders',
    method: 'get',
    params
  });
}

export interface DeliveryOrderSuccessProps {
  number: number;
  role_id: string;
  role_name: string;
  user_id: string;
  username: string;
  workwx_user_id: string;
}

export function autoDeliveryNumber(params: {
  type: 'fail' | 'new';
}): Promise<ResponseJson<DeliveryOrderSuccessProps[]>> {
  return request({
    url: '/card/purchaser/delivery/numbers',
    method: 'get',
    params
  });
}

export interface HandleDeliveryProps {
  shop_id: string;
  platform: 'walmart' | 'tiktok';
  platform_order_id: string;
  customer_order_id: string;
}
export interface HandDeliveryOrderDto {
  user_id: string;
  order_list: HandleDeliveryProps[];
}
export function handDeliveryOrder(data: HandDeliveryOrderDto): Promise<any> {
  return request({
    url: '/card/purchaser/delivery/orders/add',
    method: 'post',
    data
  });
}

export interface AutoDeliveryOrderDto {
  user_list: DeliveryOrderSuccessProps[];
  type: 'fail' | 'new';
}
export function autoDeliveryOrder(data: AutoDeliveryOrderDto): Promise<any> {
  return request({
    url: '/card/purchaser/delivery/orders/auto',
    method: 'post',
    data
  });
}
