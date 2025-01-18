<template>
  <div class="navbarContainer">
    <div class="leftBox">
      <Hamburger />
      <div class="breadcrumb xsHidden">
        <Breadcrumb />
      </div>
    </div>
    <div class="rightBox">
      <div class="xsHidden">
        <Search />
      </div>
      <div class="xsHidden">
        <Screenfull />
      </div>
      <div class="vr" />
      <div>
        <UserDropdown />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Hamburger from './components/Hamburger/index.vue';
import UserDropdown from './components/userDropdown/index.vue';
import Screenfull from './components/Screenfull/index.vue';
import Breadcrumb from './components/Breadcrumb/index.vue';
import Search from './components/Search/index.vue';
import { useRouterStore } from '@/store/modules/router';
import { shallowRef } from 'vue';

const routerStore = useRouterStore();
// 这里要改成按钮权限
const showNotify = shallowRef(false);
routerStore.asyncRoutes.forEach((item) => {
  if (item.name === 'NotifyList') {
    showNotify.value = true;
  }
});
</script>
<style lang="scss" scoped>
.navbarContainer {
  & {
    height: 100%;
    background-color: var(--navbar-background-color);
    padding: var(--navbar-padding);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  @media screen and (max-width: 768px) {
    & .xsHidden {
      display: none;
    }
  }
  & > .leftBox {
    display: flex;
    align-items: center;
    & > .breadcrumb {
      margin-left: 10px;
    }
  }
  & > .rightBox {
    & > div {
      margin: 0 4px;
      &:last-child {
        margin-right: 0;
      }
      &:first-child {
        margin-left: 0;
      }
    }
    & > div.vr {
      width: 1px;
      background-color: #eaeaea;
      height: 20px;
      margin: 0 2px;
    }
    display: flex;
    align-items: center;
  }
}
</style>
