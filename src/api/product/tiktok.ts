import { baseURL, ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export type ProductStatus = 0 | 1 | 2;

export interface TiktokProductProps {
  shop_id: string;
  asin: string;
  pasin: string;
  price: number;
  shop_price: number;
  product_image: string[];
  product_id: string;
  global_product_id: string;
  seller_sku: string;
  sku_id: string;
  global_sku_id: string;
  shipping_fee: number;
  warehouses_id: string;
  stock: number;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
  shop_name: string;
  new_title: string;
  productImageUrl: string;
}

export interface TiktokProductFilterProps {
  shop_id: string;
  status: ProductStatus;
  asin: string;
  sku: string;
}

export interface GetProductDto extends Partial<TiktokProductFilterProps> {
  page: number;
  page_size?: number;
}

export function getTiktokProductList(
  params: GetProductDto
): Promise<ResponsePageJson<TiktokProductProps>> {
  return request({
    url: '/tiktok/products/list',
    method: 'get',
    params
  });
}

export interface UpdateInventoryDto {
  shop_id: string;
  warehouses_id: string;
  product_id: string;
  sku_id: string;
  stock: number;
}

export function updateInventory(data: UpdateInventoryDto): Promise<any> {
  return request({
    url: '/tiktok/products/setting/up/inventory',
    method: 'put',
    data
  });
}

export const tiktokImageUrl = (path: string) => `${baseURL}/tiktok/product/image?path=${path}`;
