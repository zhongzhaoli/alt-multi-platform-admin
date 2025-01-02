import { SystemResponsePageJson, TiktokPageListJson } from "@/config/request";
import { request } from "@/utils/request";

export enum ProductStatusEnum {
  "ON_SALE" = "ON_SALE",
  "OFF_SALE" = "OFF_SALE",
  "OUT_OF_STOCK" = "OUT_OF_STOCK",
}

export interface LocalProductProps {
  platform: string;
  productImageUrl: string;
  productName: string;
  productSku: string;
  productAsin: string;
  sellerCountry: string;
  brand: string;
  status: ProductStatusEnum;
  price: number;
  deliveryMethod: boolean;
  deliveryTime: boolean;
}

export interface LocalProductFilterProps {
  platform: string;
  status: ProductStatusEnum;
}

export interface GetProductDto extends Partial<LocalProductFilterProps> {
  page: number;
  pageSize?: number;
}

export function getLocalProductList(
  params: GetProductDto,
): Promise<SystemResponsePageJson<LocalProductProps>> {
  return request({
    url: "/product/local/list",
    method: "get",
    params,
  });
}
