import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface ListingProps {
  created_at: string;
  feed_id: string;
  feed_status: string;
  feed_submission_date: string;
  id: number;
  items_failed: number;
  items_processing: number;
  items_received: number;
  items_succeeded: number;
  shop_id: string;
  shop_name: string;
  updated_at: string;
  type: 'Products' | 'Prices';
}

export interface ListingFilterProps {
  start_date: string;
  end_date: string;
  type: 'Products' | 'Prices' | 'Inventory';
}

export interface GetListingDto extends Partial<ListingFilterProps> {
  page: number;
  page_size?: number;
}
export function getWalmartListingList(
  params: GetListingDto
): Promise<ResponsePageJson<ListingProps>> {
  return request({
    url: '/walmart/products/listing/monitor',
    method: 'get',
    params
  });
}

export function getTiktokListingList(
  params: GetListingDto
): Promise<ResponsePageJson<ListingProps>> {
  return request({
    url: '/tk/board/listing',
    method: 'get',
    params
  });
}

export function getWalmartSummary(params: GetListingDto): Promise<ResponsePageJson<ListingProps>> {
  return request({
    url: '/walmart/board/listing/summary',
    method: 'get',
    params
  });
}

export function getTiktokSummary(params: GetListingDto): Promise<ResponsePageJson<ListingProps>> {
  return request({
    url: '/tk/board/listing/summary',
    method: 'get',
    params
  });
}
