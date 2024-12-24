<template>
  <div class="layoutContainer">
    <el-container>
      <el-aside class="layoutSidebarBox" :class="{ hideSidebar: isCollapse }">
        <Sidebar />
      </el-aside>
      <el-container>
        <el-header class="layoutNavbarBox">
          <Navbar />
        </el-header>
        <div class="layoutTagsViewBox">
          <TagsView />
        </div>
        <el-main class="layoutAppMainBox">
          <AppMain />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar/index.vue';
import Navbar from './components/Navbar/index.vue';
import AppMain from './components/AppMain/index.vue';
import TagsView from './components/TagsView/index.vue';
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useWindowSizeFn, type windowSizeProp } from '@/hooks/useWindowSizeFn';

const appStore = useAppStore();
const isCollapse = computed(() => !appStore.sidebarOpened);

const { addListener } = useWindowSizeFn();
addListener((windowSize: windowSizeProp) => {
  const { width } = windowSize;
  if (width.value <= 768) {
    appStore.setSidebarOpened(false);
  } else {
    appStore.setSidebarOpened(true);
  }
});
</script>
<style lang="scss" scoped>
.layoutSidebarBox {
  width: var(--sidebar-width);
  border-right: 1px rgba(5, 5, 5, 0.06) solid;
  height: 100vh;
  overflow: auto;
  transition: width 0.3s;
  will-change: auto;
  &.hideSidebar {
    width: var(--sidebar-closed-width);
  }
}
.layoutNavbarBox {
  padding: 0;
  height: var(--navbar-height);
}
.layoutTagsViewBox {
  width: 100%;
  height: var(--tagsView-height);
  box-shadow: 2px 0 3px 0 rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 9;
}
.layoutAppMainBox {
  height: var(--appMain-height);
  background-color: var(--appMain-background-color);
  flex: unset;
  overflow-y: auto;
  padding: 0;
  will-change: auto;
}
</style>
