import { ResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";

export interface ListingProps {
  id: number;
  platform: string;
  shopName: string;
  shopId: string;
  totalLinkCount: number;
  onSaleLinkCount: number;
  todayOnSaleLinkCount: number;
  todayOffSaleLinkCount: number;
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
    url: "/listing/list",
    method: "get",
    params,
  });
}
