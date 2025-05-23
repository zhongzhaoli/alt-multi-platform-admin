import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

interface GetDeliveryOrderDto {
  page: number;
  page_size?: number;
}

// 列表
export function getTemuDeliveryOrder(params: GetDeliveryOrderDto): Promise<ResponsePageJson<any>> {
  return request({
    url: '/temu/orders/deliver/list',
    method: 'get',
    params
  });
}
