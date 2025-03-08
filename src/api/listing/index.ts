import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface ListingProps {
  created_date: string;
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

export interface FeedListProps {
  feed_id: string;
  shop_id: string;
  feed_status: string;
}

export type IngestionStatus = 'SUCCESS' | 'TIMEOUT_ERROR' | 'DATA_ERROR' | 'SYSTEM_ERROR';
export interface WalmartFeedDetailProps {
  ingestion_errors: object | null;
  ingestion_status: IngestionStatus;
  item_id: string;
  product_identifiers: object | null;
  shop_id: string;
  sku: string;
}
export interface TiktokFeedDetailPublishResultProps {
  region: string;
  status: string;
  fail_reasons: any[];
}
export interface TiktokFeedDetailProps {
  publish_result: Array<TiktokFeedDetailPublishResultProps> | null;
  publish_result_first_children: TiktokFeedDetailPublishResultProps | null;
  products: object | null;
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
    url: '/tiktok/products/listing/monitor',
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

export interface GetDetailListDto {
  created_date: string;
  shop_id: string;
  type: 'Products' | 'Prices' | 'Inventory';
  page: number;
  page_size?: number;
  feed_id?: string;
}

export function getWlamartFeedList(
  params: GetDetailListDto
): Promise<ResponsePageJson<FeedListProps>> {
  return request({
    url: '/walmart/products/listing/monitor/feed/ids',
    method: 'get',
    params
  });
}

export function getTiktokFeedList(
  params: GetDetailListDto
): Promise<ResponsePageJson<FeedListProps>> {
  return request({
    url: '/tiktok/products/listing/monitor/feed/ids',
    method: 'get',
    params
  });
}

export interface GetDetailDto {
  page: number;
  page_size?: number;
  feed_id: string;
  ingestion_status?: IngestionStatus;
  sku?: string;
}

export function getWalmartDetail(
  params: GetDetailDto
): Promise<ResponsePageJson<WalmartFeedDetailProps>> {
  return request({
    url: '/walmart/products/listing/monitor/details',
    method: 'get',
    params
  });
}

export function getTiktokDetail(
  params: GetDetailDto
): Promise<ResponsePageJson<TiktokFeedDetailProps>> {
  return request({
    url: '/tiktok/products/listing/monitor/details',
    method: 'get',
    params
  });
}
