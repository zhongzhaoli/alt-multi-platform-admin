import { type Router } from 'vue-router';
import { listenerGuard } from './listenerGuard';
import { permissionGuard } from './permissionGuard';

export function setupRouterGuard(router: Router) {
  listenerGuard(router);
  permissionGuard(router);
}
