import { ResponsePageJson, walmartURL } from "@/config/request";
import { request } from "@/utils/request";

export interface ListingProps {
  all_count: number;
  for_sale_count: number;
  listing_count: number;
  platform: string;
  remove_count: number;
  shop_id: string;
  shop_name: string;
}

export interface ListingFilterProps {
  platform: string;
}

export interface GetListingDto extends Partial<ListingFilterProps> {
  page: number;
  pageSize?: number;
}
export function getListingList(
  params: GetListingDto,
): Promise<ResponsePageJson<ListingProps>> {
  return request({
    baseURL: walmartURL,
    url: "/get_all_listing_board",
    method: "get",
    params,
  });
}
