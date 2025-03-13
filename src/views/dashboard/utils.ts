import { StoreProps as WalmartStoreProps } from '@/api/system/walmartStore';
import { StoreProps as TiktokStoreProps } from '@/api/system/tiktokStore';
import moment from 'moment-timezone';

export const getLastSeventDays = () => {
  // 获取当前日期
  const today = moment();
  // 初始化一个数组来存储日期
  const last7Days = [];
  // 循环生成最近 7 天的日期
  for (let i = 0; i < 7; i++) {
    const date = today.clone().subtract(i, 'days');
    last7Days.unshift(date.format('YYYY-MM-DD'));
  }
  return last7Days;
};
