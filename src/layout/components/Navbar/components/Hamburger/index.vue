<template>
  <div class="hamburgerContainer navbarWidgetItem" @click="toggleCollapse">
    <i v-if="appStore.sidebarOpened" class="ri-menu-fold-line" />
    <i v-else class="ri-menu-unfold-line" />
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
const appStore = useAppStore();
// 切换侧边栏打开状态
const toggleCollapse = () => {
  appStore.toggleSidebarCollapsed();
};
</script>
<style lang="scss" scoped>
.hamburgerContainer {
}
</style>
