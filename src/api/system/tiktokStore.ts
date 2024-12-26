import { ResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";

export interface StoreProps {
  shopId: string;
  shopName: string;
  createTime: string;
}
export interface GetStoreDto {
  page: number;
  pageSize?: number;
  shopName?: string;
}

// 获取店铺列表
export function getStoreList(
  params?: GetStoreDto,
): Promise<ResponsePageJson<StoreProps>> {
  return request({
    url: "/tiktok/shop/list",
    method: "get",
    params,
  });
}

// 获取店铺列表 - 权限限制
export function getStoreListAuth(
  params?: GetStoreDto,
): Promise<ResponsePageJson<StoreProps>> {
  return request({
    url: "/tiktok/shop/user/list",
    method: "get",
    params,
  });
}
