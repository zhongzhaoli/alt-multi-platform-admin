import { ref } from 'vue';
import { routeChange } from '@/hooks/useRouteListener';
import { type Router } from 'vue-router';
import { getAppEnvConfig } from '@/utils/env';

const isLoading = ref(false);

export function listenerGuard(router: Router) {
  router.beforeEach((_to, _from, next) => {
    isLoading.value = true;
    next();
  });
  router.afterEach((to) => {
    routeChange(to);
    const { VITE_GLOB_APP_NAME } = getAppEnvConfig();
    document.title = `${to.meta.title} - ${VITE_GLOB_APP_NAME}`;
    setTimeout(() => {
      isLoading.value = false;
    }, 300);
  });
}

export { isLoading };
