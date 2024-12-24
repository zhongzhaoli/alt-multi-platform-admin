import { ResponseJson } from '@/config/request';
import { request } from '@/utils/request';

// 获取七牛云上传Token
export function getQiniuToken(): Promise<ResponseJson<string>> {
  return request({
    url: '/qiniu/temp/token',
    method: 'get',
  });
}
