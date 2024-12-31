import { ResponseJson } from "@/config/request";
import { ROUTE_TYPE } from "@/constants/route";
import { request } from "@/utils/request";
import { _RouteRecordBase } from "vue-router";

export interface DataProps extends _RouteRecordBase {
  id: number;
  pid: number;
}

export interface GetRouterDto {
  title?: string;
  path?: string;
}
export function getRouterList(
  params?: GetRouterDto,
): Promise<ResponseJson<DataProps[]>> {
  return request({
    url: "/router/tree",
    method: "get",
    params,
  });
}

export interface CreateRouterDto {
  pid: number;
  path: string;
  name: string;
  title: string;
  type: ROUTE_TYPE | null;
  permission?: string;
  icon?: string;
  component?: string;
  breadcrumb_hidden: boolean;
  hidden: boolean;
  affix: boolean;
  keep_alive: boolean;
  sort: number;
}
export function createRouter(data: CreateRouterDto): Promise<any> {
  return request({
    url: "/router/create",
    method: "post",
    data,
  });
}

export interface UpdateRouterDto extends CreateRouterDto {
  id: number;
}
export function updateRouter(data: UpdateRouterDto): Promise<any> {
  return request({
    url: "/router/update",
    method: "put",
    data,
  });
}
