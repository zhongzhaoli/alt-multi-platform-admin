import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface StoreProps {
  id: number;
  mallid: string;
  miaoshou_cookie: string;
  shop_id: string;
  shop_name: string;
  shop_status: 0 | 1;
  temu_cookie: string;
}
export interface GetStoreDto {
  page: number;
  page_size?: number;
  shop_name?: string;
}

// 获取店铺列表
export function getStoreList(params?: GetStoreDto): Promise<ResponsePageJson<StoreProps>> {
  return request({
    url: '/temu/shop/list',
    method: 'get',
    params
  });
}
