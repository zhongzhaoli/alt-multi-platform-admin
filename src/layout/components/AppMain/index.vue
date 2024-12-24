<template>
  <div class="appMainContainer">
    <template v-if="isLoading">
      <Loading />
    </template>
    <router-view>
      <template #default="{ Component, route }">
        <Transition name="appMain" mode="out-in" appear>
          <keep-alive :include="tagsViewStore.cachedViews">
            <component :is="Component" :key="route.path" />
          </keep-alive>
        </Transition>
      </template>
    </router-view>
  </div>
</template>
<script setup lang="ts">
import Loading from '@/components/Loading/index.vue';
import { isLoading } from '@/router/guard/listenerGuard';
import { useTagsViewStore } from '@/store/modules/tagsView';
const tagsViewStore = useTagsViewStore();
</script>
<style lang="scss" scoped>
.appMainContainer {
  position: relative;
  height: 100%;
}
</style>
