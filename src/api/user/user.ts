import { ResponseJson } from '@/config/request';
import { UserInfo } from '@/store/modules/user';
import { request } from '@/utils/request';
import { _RouteRecordBase } from 'vue-router';

export function getUserInfo() {
  return request<ResponseJson<UserInfo>>({
    url: '/user/me',
    method: 'get'
  });
}

export interface UserRoutesProps extends _RouteRecordBase {
  id: number;
  pid: number;
}

export function getUserRoutes(): Promise<ResponseJson<UserRoutesProps[]>> {
  return request({
    url: '/role/router/tree',
    method: 'get'
  });
}

export interface ChangePasswordDto {
  old_password: string;
  new_password: string;
}

export function changePassword(data: ChangePasswordDto): Promise<any> {
  return request({
    url: '/users/password/update',
    method: 'put',
    data
  });
}
