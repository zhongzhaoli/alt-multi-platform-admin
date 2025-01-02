import { ResponseJson, ResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";

export interface GetStoreDto {
  page: number;
  page_size?: number;
  shop_name?: string;
}

export interface StoreProps {
  id: number;
  shop_id: string;
  shop_name: string;
  client_id: string;
  client_secret: string;
  created_at: string;
}

export interface HandleStoreProps {
  id: number;
  shop_id: string;
  balance: number;
  shopName: string;
  client: string;
  clientSecret: string;
}

// 获取店铺列表 - 系统管理
export function getStoreList(
  params?: GetStoreDto,
): Promise<ResponsePageJson<StoreProps>> {
  return request({
    url: "/walmart/shop/list",
    method: "get",
    params,
  });
}

// 新增店铺
export interface CreateStoreDto {
  shopId: string;
  shopName: string;
  client: string;
  clientSecret: string;
  shopPartnerId: string;
}
export function createStore(data: CreateStoreDto) {
  return request({
    url: "/walmart/shop",
    method: "post",
    data,
  });
}

// 编辑店铺
export interface EditStoreDto extends Partial<CreateStoreDto> {
  id: number;
}
export function editStore(data: EditStoreDto): Promise<any> {
  return request({
    url: `/walmart/shop/${data.id}`,
    method: "put",
    data,
  });
}

// 删除店铺
export function deleteStore(row: StoreProps): Promise<any> {
  return request({
    url: "/walmart/shop",
    method: "delete",
    data: { id: row.id, shopId: row.shop_id, shopName: row.shop_name },
  });
}

// 用户绑定店铺回显
export function userStoreIds(userId: string): Promise<ResponseJson<string[]>> {
  return request({
    url: "/walmart/shop/ids",
    method: "get",
    params: { user_id: userId },
  });
}

// 绑定店铺
export interface WalmartBindDto {
  user_id: string;
  walmart_shop_ids: string[];
}
export function userBindStore(data: WalmartBindDto): Promise<any> {
  return request({
    url: "/user/authorize/walmart/shops",
    method: "put",
    data,
  });
}

// 获取店铺列表 - 权限限制
export function getStoreListAuth(
  params?: GetStoreDto,
): Promise<ResponsePageJson<StoreProps>> {
  return request({
    url: "/walmart/shop/user/list",
    method: "get",
    params,
  });
}
