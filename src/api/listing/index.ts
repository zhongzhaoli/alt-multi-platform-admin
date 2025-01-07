import { ResponsePageJson, walmartURL } from "@/config/request";
import { request } from "@/utils/request";

export interface ListingProps {
  all_count: number;
  for_sale_count: number;
  listing_count: number;
  platform: "Walmart" | "Tiktok";
  remove_count: number;
  shop_id: string;
  shop_name: string;
  listing_rate: string;
  listing_rating: number;
  listing_survival: 1 | 0;
}

export interface ListingFilterProps {
  start_date: string;
  end_date: string;
}

export interface GetListingDto extends Partial<ListingFilterProps> {
  page: number;
  page_size?: number;
  order?: string;
}
export function getWalmartListingList(
  params: GetListingDto,
): Promise<ResponsePageJson<ListingProps>> {
  return request({
    baseURL: walmartURL,
    url: "/walmart/board/listing",
    method: "get",
    params,
  });
}

export function getTiktokListingList(
  params: GetListingDto,
): Promise<ResponsePageJson<ListingProps>> {
  return request({
    baseURL: walmartURL,
    url: "/tk/board/listing",
    method: "get",
    params,
  });
}

export function getWalmartSummary(
  params: GetListingDto,
): Promise<ResponsePageJson<ListingProps>> {
  return request({
    baseURL: walmartURL,
    url: "/walmart/board/listing/summary/",
    method: "get",
    params,
  });
}

export function getTiktokSummary(
  params: GetListingDto,
): Promise<ResponsePageJson<ListingProps>> {
  return request({
    baseURL: walmartURL,
    url: "/tk/board/listing/summary/",
    method: "get",
    params,
  });
}
