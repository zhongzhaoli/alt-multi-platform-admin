import { ResponseJson } from "@/config/request";
import { UserInfo } from "@/store/modules/user";
import { request } from "@/utils/request";
import { RouteRecordRaw } from "vue-router";

export function getUserInfo() {
  return request<ResponseJson<UserInfo>>({
    url: "/user/me",
    method: "get",
  });
}

export function getUserRoutes(): Promise<ResponseJson<RouteRecordRaw[]>> {
  return request({
    url: "/role/router/tree",
    method: "get",
  });
}

export interface ChangePasswordDto {
  old_password: string;
  new_password: string;
}

export function changePassword(data: ChangePasswordDto): Promise<any> {
  return request({
    url: "/users/password/update",
    method: "put",
    data,
  });
}
