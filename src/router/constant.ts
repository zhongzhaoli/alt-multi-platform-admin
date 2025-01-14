import { type RouteRecordRaw } from 'vue-router';
import { createWebHashHistory, createWebHistory } from 'vue-router';
import { getAppEnvConfig } from '@/utils/env';
const { VITE_GLOB_ROUTER_MODE, VITE_GLOB_PUBLIC_PATH } = getAppEnvConfig();

export enum PageEnum {
  BASE_LOGIN = '/login'
}

export const WHITE_PATH_LIST: string[] = [PageEnum.BASE_LOGIN];

// 路由模式
export const ROUTE_MODE =
  VITE_GLOB_ROUTER_MODE === 'hash'
    ? createWebHashHistory(VITE_GLOB_PUBLIC_PATH)
    : createWebHistory(VITE_GLOB_PUBLIC_PATH);

// Layout
export const LAYOUT = () => import('@/layout/index.vue');

// Login
export const LOGIN = () => import('@/views/login/index.vue');

// PAGE NOT FOUND
export const PAGE_NOT_FOUND = () => import('@/views/errorPage/404.vue');

// PAGE ERROR
export const PAGE_ERROR = () => import('@/views/errorPage/500.vue');

// 根路由
export const ROOT_ROUTE: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  meta: {
    title: 'Root',
    hideBreadcrumb: true
  },
  children: []
};

// 页面找不到路由
export const PAGE_NOT_FOUND_ROUTE: RouteRecordRaw = {
  path: '/:pathMatch(.*)*',
  name: 'PageNotFound',
  component: PAGE_NOT_FOUND,
  meta: {
    title: '页面不存在',
    showTagsView: false,
    hidden: true
  }
};

// 服务器错误
export const PAGE_ERROR_ROUTE: RouteRecordRaw = {
  path: '/error',
  name: 'PageError',
  component: PAGE_ERROR,
  meta: {
    title: '服务器错误',
    showTagsView: false,
    hidden: true
  }
};

// 静态路由
export const BASIC_ROUTES: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: LOGIN,
    meta: {
      title: '登录',
      hidden: true
    }
  }
];
