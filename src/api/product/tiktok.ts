import { mockURL, ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export enum ProductStatusEnum {
  'UNPUBLISHED' = 'UNPUBLISHED',
  'PUBLISHED' = 'PUBLISHED',
  'ERROR' = 'ERROR'
}

export interface TiktokProductProps {
  platform: string;
  shopName: string;
  shopId: string;
  productImageUrl: string;
  productName: string;
  productSku: string;
  productId: string;
  price: number;
  status: ProductStatusEnum;
  stock: number;
  stockWarning: boolean;
}

export interface TiktokProductFilterProps {
  platform: string;
  shopId: string;
  status: ProductStatusEnum;
}

export interface GetProductDto extends Partial<TiktokProductFilterProps> {
  page: number;
  pageSize?: number;
}

export function getTiktokProductList(
  params: GetProductDto
): Promise<ResponsePageJson<TiktokProductProps>> {
  return request({
    baseURL: mockURL,
    url: '/product/tiktok/list',
    method: 'get',
    params
  });
}
