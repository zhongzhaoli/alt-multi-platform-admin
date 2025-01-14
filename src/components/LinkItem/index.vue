<template>
  <div class="linkItem">
    <a v-if="text" class="textBox" :href="href || 'javascript:void(0)'" target="_blank">
      <i class="ri-share-box-line" />
      <div class="textEllipsis" :style="{ maxWidth: width }">
        <TextEllipsis :text="text" />
      </div>
    </a>
    <span v-else>-</span>
  </div>
</template>
<script setup lang="ts">
import TextEllipsis from '@/components/TextEllipsis/index.vue';
interface ComponentProps {
  text: string | null;
  href: string | null;
  width?: string;
}

withDefaults(defineProps<ComponentProps>(), {
  width: 'unset'
});
</script>
<style lang="scss" scoped>
.linkItem {
  display: inline-block;
  & > .textBox {
    color: var(--el-color-primary);
    transition: color 0.2s;
    display: flex;
    justify-content: center;
    &:hover {
      color: var(--el-color-primary-light-5);
    }
    & > i {
      margin-right: 4px;
    }
    & > .textEllipsis {
      flex: 1;
    }
  }
}
</style>
