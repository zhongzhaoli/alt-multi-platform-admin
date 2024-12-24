import { ResponseJson, ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface RoleProps {
  id: number;
  role_id: string;
  role_name: string;
  create_time: string;
}

export interface GetRoleDto {
  page: number;
  page_size?: number;
  role_name?: string;
}

export interface CreateRoleDto {
  role_name: string;
}

export interface EditRoleDto extends CreateRoleDto {
  id: number;
}

export interface SetRoleRouterDto {
  role_id: string;
  router_ids: string[];
}

export function getRoleList(params: GetRoleDto): Promise<ResponsePageJson<RoleProps>> {
  return request({
    url: '/role/list',
    method: 'get',
    params
  });
}

export function createRole(data: CreateRoleDto): Promise<any> {
  return request({
    url: '/role/add',
    method: 'post',
    data
  });
}

export function editRole(data: EditRoleDto): Promise<any> {
  return request({
    url: `/role/update`,
    method: 'put',
    data
  });
}

export function getRoleRouter(role_id: string): Promise<ResponseJson<string[]>> {
  return request({
    url: '/router/id/list/role/access',
    method: 'get',
    params: {
      role_id
    }
  });
}

export function setRoleRouter(data: SetRoleRouterDto) {
  return request({
    url: '/router/update/role/access',
    method: 'put',
    data
  });
}
