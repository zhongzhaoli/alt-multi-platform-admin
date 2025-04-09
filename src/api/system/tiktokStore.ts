import { ResponseJson, ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface StoreProps {
  shop_id: string;
  shop_name: string;
  created_at: string;
  app_secret: string;
  app_key: string;
  category_name: string;
  id: number;
  available: 0 | 1;
  pause: 0 | 1;
  listing_min_price: number;
  listing_max_price: number;
}
export interface GetStoreDto {
  page: number;
  page_size?: number;
  shop_name?: string;
  available?: 0 | 1;
  pause?: 0 | 1;
}

// 获取店铺列表
export function getStoreList(params?: GetStoreDto): Promise<ResponsePageJson<StoreProps>> {
  return request({
    url: '/tiktok/shop/list',
    method: 'get',
    params
  });
}

// 用户绑定店铺回显
export function userStoreIds(userId: string): Promise<ResponseJson<string[]>> {
  return request({
    url: '/tiktok/shop/ids',
    method: 'get',
    params: { user_id: userId }
  });
}

export interface CreateStoreDto {
  shop_id: string;
  shop_name: string;
  app_secret: string;
  app_key: string;
  listing_min_price: number;
  listing_max_price: number;
}

// 编辑店铺
export interface EditStoreDto extends Partial<CreateStoreDto> {
  id: number;
  pause: 1 | 0;
}
export function editStore(data: EditStoreDto): Promise<any> {
  return request({
    url: `/tiktok/shop/edit`,
    method: 'put',
    data
  });
}
export function editPauseStore(_id: string | number, data: EditStoreDto): Promise<any> {
  return request({
    url: `/tiktok/shop/edit`,
    method: 'put',
    data
  });
}

// 绑定店铺
export interface TiktokBindDto {
  user_id: string;
  tiktok_shop_ids: string[];
}
export function userBindStore(data: TiktokBindDto): Promise<any> {
  return request({
    url: '/user/authorize/tiktok/shops',
    method: 'put',
    data
  });
}
