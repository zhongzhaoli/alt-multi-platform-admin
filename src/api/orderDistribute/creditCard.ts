import { baseURL } from '@/config/request';
import { request } from '@/utils/request';

export interface SaveTwoStepDto {
  two_step_img?: File;
  two_step_token?: string;
  card_number: string;
}

export function saveCreditCardTwoStep(data: FormData): Promise<any> {
  return request({
    url: '/card/purchaser/delivery/card/twostep/in',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form'
    },
    data
  });
}

export function getTwoStepImage(path: string): Promise<Blob> {
  return request({
    url: `/card/purchaser/delivery/card/img/${path}`,
    method: 'get',
    responseType: 'blob'
  });
}

export const twoStepImageUrl = (path: string) =>
  `${baseURL}/card/purchaser/delivery/card/img/${path}`;
