import { mockURL, ResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";

export enum ProductStatusEnum {
  "UNPUBLISHED" = "UNPUBLISHED",
  "PUBLISHED" = "PUBLISHED",
  "ERROR" = "ERROR",
}

export interface WalmartProductProps {
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

export interface WalmartProductFilterProps {
  platform: string;
  shopId: string;
  status: ProductStatusEnum;
}

export interface GetProductDto extends Partial<WalmartProductFilterProps> {
  page: number;
  pageSize?: number;
}

export function getWalmartProductList(
  params: GetProductDto,
): Promise<ResponsePageJson<WalmartProductProps>> {
  return request({
    baseURL: mockURL,
    url: "/product/walmart/list",
    method: "get",
    params,
  });
}
