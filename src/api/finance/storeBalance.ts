import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export enum WalmartSellerStatusEnum {
  'ACTIVE' = 'ACTIVE',
  'SUSPENDED' = 'SUSPENDED',
  'TERMINATED' = 'TERMINATED'
}

export interface GetWalmartBalanceDto {
  page: number;
  page_size?: number;
  shop_id?: string;
}

export interface WalmartStoreBalanceProps {
  closing_balance: number;
  hold_amount: number;
  opening_balance: number;
  pay_amount: number;
  seller_status: WalmartSellerStatusEnum;
  shop_name: string;
  shop_id: string;
  last_updated_date: string;
  payment_processor: string;
  hold_dates: string;
  scheduled_settlement_date: string;
  settle_cycle: string;
}

export function getWalmartStoreBalance(
  params: GetWalmartBalanceDto
): Promise<ResponsePageJson<WalmartStoreBalanceProps>> {
  return request({
    url: '/walmart/payment',
    method: 'get',
    params
  });
}
