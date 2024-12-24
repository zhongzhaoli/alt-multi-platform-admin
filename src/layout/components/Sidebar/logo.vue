<template>
  <div class="logoContainer">
    <Transition name="logo" mode="out-in">
      <router-link v-if="isCollapse" to="/">
        <el-image class="smallLogo" :src="smallLogo" />
      </router-link>
      <router-link v-else to="/">
        <el-image class="logo" :src="logo" />
      </router-link>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import logo from '@/assets/logoText.png';
import smallLogo from '@/assets/smallLogo.png';
const appStore = useAppStore();
const isCollapse = computed(() => !appStore.sidebarOpened);
</script>
<style lang="scss" scoped>
.logoContainer {
  width: 100%;
  height: var(--logo-height);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  & .smallLogo {
    height: 26px; // 1:1.04 safari bug
    width: 27.04px;
    vertical-align: bottom;
  }
  & .logo {
    width: 180px;
    vertical-align: bottom;
  }
  .title {
    color: #000;
    font-size: 18px;
    letter-spacing: 1px;
    text-decoration: none;
    transition: all 0.3s;
    &.smallLogo {
      font-size: 20px;
      letter-spacing: 0px;
    }
  }
}
</style>
