import { defineStore } from 'pinia';
import { ref } from 'vue';
import { ELEMENT_UI_SIZE, SIDEBAR_OPENED, TABLE_SIZE } from '@/constants/app';
import { piniaPersistConfig } from '@/utils/persist';

export interface AppState {
  sidebarOpened: boolean;
  tableSize: ELEMENT_UI_SIZE;
}

export const useAppStore = defineStore(
  'app',
  () => {
    // 侧边栏是否展开
    const sidebarOpened = ref<boolean>(SIDEBAR_OPENED);
    // 侧边栏状态切换
    const toggleSidebarCollapsed = () => {
      sidebarOpened.value = !sidebarOpened.value;
    };
    // 设置侧边栏状态
    const setSidebarOpened = (status: boolean) => {
      sidebarOpened.value = status;
    };

    // Table Size
    const tableSize = ref<ELEMENT_UI_SIZE>(TABLE_SIZE);
    const setTableSize = (size: ELEMENT_UI_SIZE) => {
      tableSize.value = size;
    };
    return {
      sidebarOpened,
      tableSize,
      setTableSize,
      toggleSidebarCollapsed,
      setSidebarOpened
    };
  },
  {
    persist: piniaPersistConfig<Array<keyof AppState>>('APP_STORE', ['sidebarOpened'])
  }
);
