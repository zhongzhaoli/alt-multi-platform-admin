import { ElLoading } from 'element-plus';

const DEFAULT_TEXT = 'Loading';
const DEFAULT_BACKGROUND = 'rgba(255, 255, 255, 0.5)';

export function useFullLoading(text?: string, background?: string) {
  let loadingInstance: any | null = null;
  const open = () => {
    loadingInstance = ElLoading.service({
      lock: true,
      text: text || DEFAULT_TEXT,
      background: background || DEFAULT_BACKGROUND
    });
  };
  const close = () => {
    if (!loadingInstance) return;
    loadingInstance.close();
  };
  return { open, close };
}
