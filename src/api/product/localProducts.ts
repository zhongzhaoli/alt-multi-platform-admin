// 修改产品尺寸
export interface UpdateProductSizeDto {
  length: number;
  width: number;
  height: number;
  weight: number;
  clothing_type: 0 | 1;
  dangerous_type: 0 | 1;
  low_price_type: 0 | 1;
  shop_id: string;
  sku: string;
}
