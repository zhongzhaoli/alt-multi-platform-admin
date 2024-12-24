import { type Router } from 'vue-router';
import { WHITE_PATH_LIST } from '../constant';
import { registerRoute } from '../helper';
import { useRouterStore } from '@/store/modules/router';
import { useUserStore } from '@/store/modules/user';
import Progress from 'nprogress';

Progress.configure({
  parent: 'body',
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
});

export function permissionGuard(router: Router) {
  const routerStore = useRouterStore();
  const userStore = useUserStore();
  router.beforeEach(async (to, _from, next) => {
    // 白名单放行
    if (!userStore.token) {
      if (WHITE_PATH_LIST.includes(to.path as string)) {
        return next();
      } else {
        return next('/login');
      }
    }
    if (to.path === '/login') {
      return next({ path: '/' });
    }
    if (userStore.userInfo) {
      next();
    } else {
      if (userStore.token) {
        Progress.start();
        // 获取用户信息 - 同步
        const userInfo = await userStore.getUserInfo();
        if (userInfo) {
          // 防止userInfo 401 时，清除token，但是照样调用，会报body error。
          if (!userStore.token) return false;
          // 有TOKEN，获取路由接口 - 同步
          const routes = await routerStore.getRoutes();
          // 注册路由
          registerRoute(routes);
          if (Progress.status) Progress.done();
          return next({ ...to, replace: true });
        } else {
          userStore.logout();
          if (Progress.status) Progress.done();
          return next({ path: '/login', replace: true });
        }
      } else {
        return next({ path: '/login', replace: true });
      }
    }
    return false;
  });
}
