import { ResponsePageJson } from '@/config/request';
import { request } from '@/utils/request';

export interface GetSpiderDto {
  page: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
  spider_type: 'asin' | 'monitor';
}

export interface SpiderProps {
  crawl_date: string;
  id: number;
  req_200: number;
  req_captcha: number;
}

export function getSpiderList(params: GetSpiderDto): Promise<ResponsePageJson<SpiderProps>> {
  return request({
    url: '/spider/amazon/list',
    method: 'get',
    params
  });
}
