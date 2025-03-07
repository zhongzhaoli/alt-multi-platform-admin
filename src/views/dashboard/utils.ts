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

export const getWalmartAllStore = (): WalmartStoreProps[] => {
  return [
    {
      id: 0,
      shop_id: 'ALL',
      shop_name: '全部店铺',
      client_id: '',
      client_secret: '',
      created_at: ''
    }
  ];
};

export const getTiktokAllStore = (): TiktokStoreProps[] => {
  return [
    {
      id: 0,
      shop_id: 'ALL',
      shop_name: '全部店铺',
      app_secret: '',
      app_key: '',
      created_at: ''
    }
  ];
};
