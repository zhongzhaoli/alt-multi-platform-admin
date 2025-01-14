import { type RouteRecordRaw } from 'vue-router';
import {
  LAYOUT,
  BASIC_ROUTES,
  ROOT_ROUTE,
  PAGE_ERROR_ROUTE,
  PAGE_NOT_FOUND_ROUTE
} from './constant';
import { router } from './index';
import { useRouterStore } from '@/store/modules/router';

// 重置路由
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    name !== 'Login' && name && router.hasRoute(name) && router.removeRoute(name);
  });
}

export const registerRoute = (routes: any[]) => {
  const routerStore = useRouterStore();
  const newRoot = {
    ...ROOT_ROUTE,
    redirect: routes.filter((item) => !item.meta.hidden)[0]?.path,
    children: [...routesComponentInstance(routes), PAGE_ERROR_ROUTE, PAGE_NOT_FOUND_ROUTE],
    component: LAYOUT
  };
  // 清空路由
  resetRouter();
  // 注册动态路由
  const newRoutes = [...BASIC_ROUTES, newRoot] as RouteRecordRaw[];
  routerStore.setAllRoutes(newRoutes);
  newRoutes.forEach((route) => {
    router.addRoute(route);
  });
};

// 路由组件路径实例化
export const routesComponentInstance = (routes: any): RouteRecordRaw[] => {
  routes.forEach((route: any) => {
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = LAYOUT;
      } else {
        const dynamicViewsModules = import.meta.glob('../views/**/*.{vue,tsx}');
        route.component = dynamicImport(dynamicViewsModules, route.component);
      }
    }
    if (route.children && route.children.length) {
      const childrenAllHidden = route.children.every((v: any) => v.meta.hidden);
      if (!childrenAllHidden) route.redirect = route.children[0].path;
      routesComponentInstance(route.children);
    }
  });
  return routes as RouteRecordRaw[];
};

// 动态引入组件
const dynamicImport = (
  dynamicViewsModules: Record<string, () => Promise<any>>,
  component: string
) => {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace('../views', '');
    const startFlag = component.startsWith('/');
    const startIndex = startFlag ? 0 : 1;
    return k.substring(startIndex, k.length) === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  }
  console.warn('找不到此组件');
};
