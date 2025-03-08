import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export type ProductStatus = 0 | 1 | 2 | 3;
export type ProductCheckStatus = 0 | 1;

export interface WalmartProductProps {
  image_url: string[];
  shop_id: string;
  shop_name: string;
  new_title: string;
  title: string;
  asin: string;
  sku: string;
  stock: number;
  price: number;
  status: ProductStatus;
  checked: ProductCheckStatus;
  updated_at: string;
  created_at: string;
}

export interface WalmartProductFilterProps {
  platform: string;
  shopId: string;
  status: ProductStatus;
}

export interface GetProductDto extends Partial<WalmartProductFilterProps> {
  page: number;
  page_size?: number;
}

export function getWalmartProductList(
  params: GetProductDto
): Promise<ResponsePageJson<WalmartProductProps>> {
  return request({
    url: '/walmart/products/list',
    method: 'get',
    params
  });
}

export interface RetireProductProps {
  sku: string;
  shop_id: string;
  asin: string;
}
export function retireProduct(data: { products: RetireProductProps[] }): Promise<any> {
  return request({
    url: '/walmart/products/retire',
    method: 'put',
    data
  });
}
