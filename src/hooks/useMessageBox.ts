import { ElMessageBox } from 'element-plus';

export function useMessageBox(message: string, fn?: () => any, fn2?: () => any) {
  ElMessageBox.confirm(message, '提示', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
    beforeClose: async (action, instance, done) => {
      if (action === 'confirm') {
        if (fn) {
          instance.confirmButtonLoading = true;
          await fn();
          done();
        } else {
          done();
        }
      } else {
        await (fn2 && fn2());
        done();
      }
    }
  }).catch(() => {});
}
