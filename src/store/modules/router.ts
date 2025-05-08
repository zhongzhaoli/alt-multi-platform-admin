import { defineStore } from 'pinia';
import { ref } from 'vue';
import { getUserRoutes, UserRoutesProps } from '@/api/user/user';

export const useRouterStore = defineStore('router', () => {
  // 处理后的路由
  const allRoutes = ref<UserRoutesProps[]>([]);
  // 接口获取的路由
  const asyncRoutes = ref<UserRoutesProps[]>([]);

  const setAllRoutes = (routes: UserRoutesProps[]) => {
    allRoutes.value = routes;
  };

  const setAsyncRoutes = (routes: UserRoutesProps[]) => {
    asyncRoutes.value = routes;
  };

  const getRoutes = async () => {
    const { data } = await getUserRoutes();
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
