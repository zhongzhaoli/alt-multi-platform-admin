import { mockURL, ResponseJson, ResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";

interface getDashboardDataDto {
  start_date: string;
  end_date: string;
  granularity: string;
}
interface DashboardProps {
  list: number[];
  history: number[];
  date_range: string[];
}
export function getDashboardData(
  params: getDashboardDataDto,
): Promise<ResponseJson<DashboardProps>> {
  return request({
    baseURL: mockURL,
    url: "/dashboard/data",
    method: "get",
    params,
  });
}

interface GetSkuDataDto {
  page: number;
  page_size: number;
}
export interface SkuDataProps {}
export function getSkuData(
  params: GetSkuDataDto,
): Promise<ResponsePageJson<SkuDataProps>> {
  return request({
    baseURL: mockURL,
    url: "/dashboard/sku",
    method: "get",
    params,
  });
}
