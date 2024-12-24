import { useDebounceFn, useWindowSize, tryOnBeforeUnmount } from '@vueuse/core';
import mitt, { Handler } from 'mitt';
import { Ref } from 'vue';

export type windowSizeProp = { width: Ref<number>; height: Ref<number> };
type Callback = (windowSize: windowSizeProp) => void;

const emitter = mitt();
const key = Symbol('WINDOW_SIZE_CHANGE');

let lastestWindowSize: windowSizeProp;

const debouncedFn = useDebounceFn(() => {
  const { width, height } = useWindowSize();
  // 发布信息
  emitter.emit(key, { width, height });
  lastestWindowSize = { width, height };
}, 300);
window.addEventListener('resize', debouncedFn);

export function useWindowSizeFn() {
  const callbackList: Callback[] = [];

  const addListener = (callback: Callback, immediate = false) => {
    callbackList.push(callback);
    emitter.on(key, callback as Handler);
    immediate && lastestWindowSize && callback(lastestWindowSize);
  };

  const removeListener = (callback: Callback) => {
    emitter.off(key, callback as Handler);
  };

  tryOnBeforeUnmount(() => {
    for (let i = 0; i < callbackList.length; i++) {
      removeListener(callbackList[i]);
    }
  });

  return { addListener };
}
