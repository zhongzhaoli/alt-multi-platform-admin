import { ResponsePageJson, walmartURL } from '@/config/request';
import { request } from '@/utils/request';

export interface GetSpiderDto {
  page: number;
  page_size?: number;
  start_date?: string;
  end_date?: string;
}

export interface SpiderProps {
  crawl_date: string;
  id: number;
  req_200: number;
  req_captcha: number;
}

export function getSpiderList(params: GetSpiderDto): Promise<ResponsePageJson<SpiderProps>> {
  return request({
    baseURL: walmartURL,
    url: '/spider/amazon/list',
    method: 'get',
    params
  });
}
