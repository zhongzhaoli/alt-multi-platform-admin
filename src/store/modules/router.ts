import { defineStore } from 'pinia';
import { ref } from 'vue';
import { RouteRecordRaw } from 'vue-router';
import { getUserRoutes } from '@/api/user/user';

export const useRouterStore = defineStore('router', () => {
  // 处理后的路由
  const allRoutes = ref<RouteRecordRaw[]>([]);
  // 接口获取的路由
  const asyncRoutes = ref<RouteRecordRaw[]>([]);

  const setAllRoutes = (routes: RouteRecordRaw[]) => {
    allRoutes.value = routes;
  };

  const setAsyncRoutes = (routes: RouteRecordRaw[]) => {
    asyncRoutes.value = routes;
  };

  const getRoutes = async () => {
    const {
      datas: { data }
    } = await getUserRoutes();
    setAsyncRoutes(data);
    return data;
  };

  return {
    allRoutes,
    asyncRoutes,
    setAllRoutes,
    setAsyncRoutes,
    getRoutes
  };
});
