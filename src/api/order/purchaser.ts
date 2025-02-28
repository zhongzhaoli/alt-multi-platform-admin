import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

interface GetPurchaseUserDto {
  page: number;
  page_size?: number;
  user_name?: string;
  role_name?: string;
}

export interface PurchaserUserProps {
  user_id: string;
  username: string;
  workwx_user_id: string;
  role_id: string;
  role_name: string;
}

export function getPurchaserUserList(
  params: GetPurchaseUserDto
): Promise<ResponsePageJson<PurchaserUserProps>> {
  return request({
    url: '/card/purchaser/user/list',
    method: 'get',
    params
  });
}
