import { ResponseJson } from '@/config/request';
import { request } from '@/utils/request';

export interface LoginDto {
  user_name: string;
  user_passwd: string;
}

export function login(data: LoginDto): Promise<
  ResponseJson<{
    token: string;
  }>
> {
  return request({
    url: '/users/login',
    method: 'post',
    data: {
      ...data,
      user_id: ''
    }
  });
}

export function logout(data: { user_id: string }) {
  return request({
    url: '/users/logout',
    method: 'post',
    data
  });
}
