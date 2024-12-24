import { checkPermission } from '@/utils/permission';
import { App } from 'vue';

export type PermissionValue = { value: string | string[]; type: 'some' | 'every' | 'noSome' };

export function loadDirective(app: App) {
  app.directive('permission', {
    created(el) {
      el.style.display = 'none';
    },
    mounted(el, binding) {
      const value: PermissionValue = binding.value;
      if (value) {
        const hasPermission = checkPermission(value);
        if (!hasPermission) {
          el.parentNode && el.parentNode.removeChild(el);
        } else {
          el.style.display = 'unset';
        }
      } else {
        el.style.display = 'unset';
      }
    }
  });
}
