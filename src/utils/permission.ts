import { useUserStore } from '@/store/modules/user';
import { type PermissionValue } from '@/plugins/directive';

export const checkPermission = (val: PermissionValue) => {
  const userStore = useUserStore();
  if (userStore.userInfo && userStore.userInfo.permissions) {
    const permissions = userStore.userInfo.permissions;
    const { value, type } = val;
    if (type === 'some') {
      return Array.isArray(value)
        ? value.some((item) => permissions.includes(item))
        : permissions.includes(value);
    } else if (type === 'noSome') {
      return Array.isArray(value)
        ? value.every((item) => !permissions.includes(item))
        : !permissions.includes(value);
    } else {
      return Array.isArray(value)
        ? value.every((item) => permissions.includes(item))
        : permissions.includes(value);
    }
  }
  return false;
};
