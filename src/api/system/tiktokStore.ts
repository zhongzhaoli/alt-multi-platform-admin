import { ResponsePageJson } from '@/config/request';
import { getAppEnvConfig } from '@/utils/env';
import { request } from '@/utils/request';
const baseURL = getAppEnvConfig().VITE_GLOB_API_URL_TIKTOK;
export interface StoreProps {
  shop_id: string;
  seller_name: string;
  create_time: string;
}
export interface GetStoreDto {
  page: number;
  page_size?: number;
  shop_name?: string;
}

// 获取店铺列表
export function getStoreList(
  params?: GetStoreDto
): Promise<ResponsePageJson<StoreProps>> {
  return request({
    baseURL,
    url: '/tk/shops/list',
    method: 'get',
    params,
  });
}
