import { ResponseJson, ResponsePageJson } from "@/config/request";
import { request } from "@/utils/request";

export interface GetUserListDto {
  page: number;
  page_size: number;
  user_name?: string;
  user_search?: boolean;
}

export interface UserProps {
  id: number;
  access_code: string;
  department_id: string;
  department_name: string;
  last_login: string;
  update_time: string;
  user_id: string;
  user_name: string;
}

export interface UserDto {
  user_name: string;
  password: string;
  department_id: string;
  workwx_user_id: string;
  role_id: string;
}

export type EditUserDto = UserDto & Pick<UserProps, "id">;

export interface ResetPasswordDto {
  id: number;
  new_password: string;
}

export function getUserList(
  params: GetUserListDto,
): Promise<ResponsePageJson<UserProps>> {
  return request({
    url: "/users/list",
    method: "get",
    params,
  });
}

export function createUser(data: UserDto) {
  return request({
    url: "/users/add",
    method: "post",
    data,
  });
}

export function editUser(data: EditUserDto) {
  return request({
    url: "/users/update",
    method: "put",
    data,
  });
}

export function deleteUser(id: number) {
  return request({
    url: "/users/delete",
    method: "delete",
    params: { id },
  });
}

export function resetPassword(data: ResetPasswordDto) {
  return request({
    url: "/users/password/reset",
    method: "put",
    data,
  });
}

export interface UpdateStoreDto {
  user_id: string;
  shopIds: string[];
}

export function updateStore(data: UpdateStoreDto) {
  return request({
    url: "/users/shop/update",
    method: "put",
    data,
  });
}

// 获取用户已绑定的店铺
export function getUserStore(user_id: string): Promise<ResponseJson<string[]>> {
  return request({
    url: "/walmart/user/shop/ids",
    method: "get",
    params: { user_id },
  });
}

// 获取用户已绑定的下级
export function getUserLevel(user_id: string): Promise<ResponseJson<string[]>> {
  return request({
    url: `/users/level/list`,
    method: "get",
    params: { p_user_id: user_id },
  });
}

interface UpdateUserLevelDto {
  user_id: string[];
  p_user_id: string;
}
export function updateLevel(data: UpdateUserLevelDto): Promise<any> {
  return request({
    url: "/users/level/add",
    method: "post",
    data,
  });
}
