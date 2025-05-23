import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export type ProductStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface TemuProductProps {
  amazon_price: null | number;
  amazon_stock: null | number;
  amazon_uptime: string | null;
  asin: string;
  asin_to_sku: string;
  collectBoxDetailId: string;
  id: number;
  img_path_list: string[];
  monitor: null | 1 | 0;
  moveCollectTaskDetailIds: string;
  pasin: string;
  pasin_to_sku: string;
  platformItemId: string;
  price: number;
  product_name: string;
  ship_price: number;
  shop_id: string;
  shop_name: string;
  skuId: string;
  status: ProductStatus;
  stock: number;
  temu_price: number;
  push_date: string;
  confirm_date: string;
}

export interface TemuProductFilterProps {
  shop_id: string;
  status: ProductStatus;
  asin: string;
  sku: string;
  start_stock_number: number;
  end_stock_number: number;
  asin_to_sku: string;
  is_stock: 'True' | 'False';
}

export interface GetProductDto extends Partial<TemuProductFilterProps> {
  page: number;
  page_size?: number;
}

export function getTemuProductList(
  params: GetProductDto
): Promise<ResponsePageJson<TemuProductProps>> {
  return request({
    url: '/temu/product/list',
    method: 'get',
    params
  });
}
