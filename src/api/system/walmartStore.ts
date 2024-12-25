import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface GetStoreDto {
  page: number;
  page_size?: number;
  shop_name?: string;
}

export interface StoreProps {
  id: number;
  shop_id: string;
  balance: string;
  update_time: string;
  shop_name: string;
  client: string;
  client_secret: string;
  balance_update_time: string;
  partner_id: string;
}

export interface HandleStoreProps {
  id: number;
  shop_id: string;
  balance: number;
  update_time: string;
  shop_name: string;
  client: string;
  client_secret: string;
  balance_update_time: string;
}

// 获取店铺列表 - 系统管理
export function getStoreList(
  params?: GetStoreDto
): Promise<ResponsePageJson<StoreProps>> {
  return request({
    url: '/walmart/shop/list',
    method: 'get',
    params,
  });
}

// 新增店铺
export interface CreateStoreDto {
  shop_id: string;
  shop_name: string;
  client: string;
  client_secret: string;
  partner_id: string;
}
export function createStore(data: CreateStoreDto) {
  return request({
    url: '/walmart/shop',
    method: 'post',
    data,
  });
}

// 编辑店铺
export interface EditStoreDto extends Partial<CreateStoreDto> {
  id: number;
}
export function editStore(data: EditStoreDto): Promise<any> {
  return request({
    url: '/walmart/shop',
    method: 'put',
    data,
  });
}

// 删除店铺
export function deleteStore(row: StoreProps): Promise<any> {
  return request({
    url: '/walmart/shop',
    method: 'delete',
    data: { id: row.id, shop_id: row.shop_id, shop_name: row.shop_name },
  });
}

// 获取店铺列表 - 权限限制
export function getStoreListAuth(
  params?: GetStoreDto
): Promise<ResponsePageJson<StoreProps>> {
  return request({
    url: '/walmart/user/shop/list',
    method: 'get',
    params,
  });
}
