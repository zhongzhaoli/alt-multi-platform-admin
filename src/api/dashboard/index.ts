import { ResponseJson } from '@/config/request';
import { request } from '@/utils/request';

export interface ListingSummaryProps {
  download_products: number;
  shop_id: string;
  shop_name: string;
  upload_products: number;
  reupload_products: number;
}
export interface OrderSummaryProps {
  shop_id: string;
  shop_name: string;
  today_sales: number;
  today_sales_amount: number;
}
export interface ListingSummaryTotalProps {
  publish_products: number | null;
  unpublish_products: number | null;
  total_sale_products: number | null;
}
export interface WalmartListingSummaryTotalProps extends ListingSummaryTotalProps {
  retire_products: number | null;
}
export interface OrderSummaryTotalProps {
  today_total_sales: number | null;
  today_total_sales_amount: number | null;
}

export interface SevenDaysSummaryProps {
  date: string;
  publish_products: number;
  retire_products: number;
}

interface GetSummary {
  date: string;
}
export function getWalmartListingSummary(params: GetSummary): Promise<
  ResponseJson<{
    daily_summary_total_data: WalmartListingSummaryTotalProps;
    daily_summary_data: ListingSummaryProps[];
  }>
> {
  return request({
    url: '/walmart/dashboard/products/daily/summary',
    method: 'get',
    params
  });
}
export function getTiktokListingSummary(params: GetSummary): Promise<
  ResponseJson<{
    daily_summary_total_data: ListingSummaryTotalProps;
    daily_summary_data: ListingSummaryProps[];
  }>
> {
  return request({
    url: '/tiktok/dashboard/products/daily/summary',
    method: 'get',
    params
  });
}

interface GetSeventSummary {
  start_date: string;
  end_date: string;
}
export function getWalmartSevenDaysSummary(
  params: GetSeventSummary
): Promise<ResponseJson<SevenDaysSummaryProps[]>> {
  return request({
    url: '/walmart/dashboard/products/weekly/summary',
    method: 'get',
    params
  });
}
export function getTiktokSevenDaysSummary(
  params: GetSeventSummary
): Promise<ResponseJson<SevenDaysSummaryProps[]>> {
  return request({
    url: '/tiktok/dashboard/products/weekly/summary',
    method: 'get',
    params
  });
}

export function getWalmartOrderSummary(params: GetSummary): Promise<
  ResponseJson<{
    daily_summary_total_data: OrderSummaryTotalProps;
    daily_summary_data: OrderSummaryProps[];
  }>
> {
  return request({
    url: '/walmart/dashboard/orders/daily/summary',
    method: 'get',
    params
  });
}

export function getTiktokOrderSummary(params: GetSummary): Promise<
  ResponseJson<{
    daily_summary_total_data: OrderSummaryTotalProps;
    daily_summary_data: OrderSummaryProps[];
  }>
> {
  return request({
    url: '/tiktok/dashboard/orders/daily/summary',
    method: 'get',
    params
  });
}
