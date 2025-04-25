import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface GetListDto {
  page: number;
  page_size?: number;
  shop_id?: string;
  created_date?: string;
}

export interface NotificationProps {
  created_at: string;
  updated_at: string;
  id: number;
  message: 0 | 1;
  notification: 0 | 1;
  shop_id: string;
  shop_name: string;
}

export function getNotificationList(
  params: GetListDto
): Promise<ResponsePageJson<NotificationProps>> {
  return request({
    url: '/walmart/message/notify/list',
    method: 'get',
    params
  });
}
