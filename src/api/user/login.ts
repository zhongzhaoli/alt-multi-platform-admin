import { ResponseJson } from '@/config/request';
import { request } from '@/utils/request';

export interface LoginDto {
  username: string;
  password: string;
}

export function login(data: LoginDto): Promise<ResponseJson<string>> {
  return request({
    url: '/user/login',
    method: 'post',
    data
  });
}

export function logout(data: { user_id: string }) {
  return request({
    url: '/user/logout',
    method: 'post',
    data
  });
}
