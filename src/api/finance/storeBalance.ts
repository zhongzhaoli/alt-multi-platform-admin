import { ResponseJson } from '@/config/request';
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
  sort?: string;
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
export interface WalmartStoreBalanceSummaryProps {
  total_closing_balance: number;
  total_hold_amount: number;
  total_pay_amount: number;
}

export function getWalmartStoreBalance(params: GetWalmartBalanceDto): Promise<
  ResponseJson<{
    list: WalmartStoreBalanceProps[];
    total: number;
    all: WalmartStoreBalanceSummaryProps;
  }>
> {
  return request({
    url: '/walmart/payment',
    method: 'get',
    params
  });
}

export interface GetTiktokBalanceDto {
  page: number;
  page_size?: number;
  shop_id?: string;
  sort?: string;
  available?: 0 | 1;
}
export interface TiktokStoreBalanceProps {
  id: number;
  shop_id: string;
  shop_name: string;
  paid: number;
  paying: number;
  awaiting_payment: number;
  created_at: string;
  updated_at: string;
  available: 0 | 1;
}

export interface TiktokStoreBalanceSummaryProps {
  total_paid: number;
  total_paying: number;
  total_awaiting_payment: number;
}
export function getTiktokStoreBalance(params: GetTiktokBalanceDto): Promise<
  ResponseJson<{
    list: TiktokStoreBalanceProps[];
    total: number;
    all: TiktokStoreBalanceSummaryProps;
  }>
> {
  return request({
    url: '/tiktok/payment',
    method: 'get',
    params
  });
}
