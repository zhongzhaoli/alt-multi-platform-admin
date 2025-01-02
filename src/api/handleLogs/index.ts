import { SystemResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";

export interface GetLogsDto {
  page: number;
  page_size?: number;
  user_id?: string;
}

export interface LogProps {
  user_name: string;
  user_id: string;
  user_ip: string;
  position: string;
  req_content: string;
  resp_code: number;
  req_path: string;
  req_method: string;
  router_tags: string;
}

export function getLogList(
  params: GetLogsDto,
): Promise<SystemResponsePageJson<LogProps>> {
  return request({
    url: "/logs/list",
    method: "get",
    params,
  });
}
