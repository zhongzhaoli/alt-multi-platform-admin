import { SystemResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";

export interface GetUserListDto {
  page: number;
  page_size: number;
  username?: string;
}

export interface UserProps {
  create_time: string;
  create_user: string;
  id: number;
  login_ip: string;
  login_time: string;
  update_time: string;
  update_user: string;
  user_id: string;
  username: string;
}

export interface UserDto {
  username: string;
  password: string;
  department_id: string;
  workwx_user_id: string;
  role_id: string;
}

export type EditUserDto = UserDto & Pick<UserProps, "id">;

export interface ResetPasswordDto {
  id: number;
  password: string;
}

export function getUserList(
  params: GetUserListDto,
): Promise<SystemResponsePageJson<UserProps>> {
  return request({
    url: "/user/list",
    method: "get",
    params,
  });
}

export function createUser(data: UserDto) {
  return request({
    url: "/user/add",
    method: "post",
    data,
  });
}

export function editUser(data: EditUserDto) {
  return request({
    url: "/user/edit",
    method: "put",
    data,
  });
}

export function deleteUser(id: number) {
  return request({
    url: "/user/delete",
    method: "delete",
    params: { id },
  });
}

export function resetPassword(data: ResetPasswordDto) {
  return request({
    url: "/user/edit",
    method: "put",
    data,
  });
}
