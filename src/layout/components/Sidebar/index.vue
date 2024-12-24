<template>
  <div class="sidebarContainer">
    <Logo />
    <div class="menuContainer">
      <el-scrollbar>
        <SideBarMenu />
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup lang="ts">
import Logo from './logo.vue';
import { useRouterStore } from '@/store/modules/router';
import createSidebar from './createSidebar';

const { allRoutes } = useRouterStore();
const SideBarMenu = createSidebar(allRoutes);
</script>
<style lang="scss" scoped>
.sidebarContainer {
  height: 100%;
  color: #fff;
  & > .menuContainer {
    height: calc(100% - var(--logo-height));
    box-shadow: 2px 0 3px 0 rgba(0, 0, 0, 0.08);
  }
}
</style>
