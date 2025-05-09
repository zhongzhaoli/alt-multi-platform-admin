import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export type ProductStatus = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface SheinProductProps {
  asin: string;
  id: number;
  img_path_list: string[];
  inventory_quantity: null | number;
  pasin: string;
  price: number;
  shein_sku: string;
  shop_id: string;
  shop_price: number;
  skc_name: string;
  spu_name: string;
  status: 3;
  supplier_code: string;
  supplier_sku: string;
  up_datetime: string;
  new_title: string;
}

export interface SheinProductFilterProps {
  shop_id: string;
  status: ProductStatus;
  asin: string;
  sku: string;
  start_stock_number: number;
  end_stock_number: number;
}

export interface GetProductDto extends Partial<SheinProductFilterProps> {
  page: number;
  page_size?: number;
}

export function getSheinProductList(
  params: GetProductDto
): Promise<ResponsePageJson<SheinProductProps>> {
  return request({
    url: '/shein/product/list',
    method: 'get',
    params
  });
}
