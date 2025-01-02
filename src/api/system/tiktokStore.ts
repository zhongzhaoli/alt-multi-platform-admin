import { ResponseJson, SystemResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";

export interface StoreProps {
  shop_id: string;
  shop_name: string;
  created_at: string;
  app_secret: string;
  app_key: string;
  id: number;
}
export interface GetStoreDto {
  page: number;
  page_size?: number;
  shopName?: string;
}

// 获取店铺列表
export function getStoreList(
  params?: GetStoreDto,
): Promise<SystemResponsePageJson<StoreProps>> {
  return request({
    url: "/tiktok/shop/list",
    method: "get",
    params,
  });
}

// 用户绑定店铺回显
export function userStoreIds(userId: string): Promise<ResponseJson<string[]>> {
  return request({
    url: "/tiktok/shop/ids",
    method: "get",
    params: { user_id: userId },
  });
}

// 绑定店铺
export interface TiktokBindDto {
  user_id: string;
  tiktok_shop_ids: string[];
}
export function userBindStore(data: TiktokBindDto): Promise<any> {
  return request({
    url: "/user/authorize/tiktok/shops",
    method: "put",
    data,
  });
}

// 获取店铺列表 - 权限限制
// export function getStoreListAuth(
//   params?: GetStoreDto
// ): Promise<ResponsePageJson<StoreProps>> {
//   return request({
//     url: '/tiktok/shop/user/list',
//     method: 'get',
//     params,
//   });
// }
