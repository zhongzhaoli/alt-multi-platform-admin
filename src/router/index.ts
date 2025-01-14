import { type App } from 'vue';
import { createRouter } from 'vue-router';
import { BASIC_ROUTES, ROUTE_MODE, PAGE_ERROR_ROUTE } from './constant';

// 创建路由
export const router = createRouter({
  history: ROUTE_MODE,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
  routes: [...BASIC_ROUTES, PAGE_ERROR_ROUTE]
});

// 配置路由
export function setupRouter(app: App<Element>) {
  app.use(router);
}
