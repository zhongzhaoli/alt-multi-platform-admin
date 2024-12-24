<template>
  <div class="linkItem">
    <a v-if="text" class="textBox" :href="href || 'javascript:void(0)'" target="_blank">
      <i class="ri-share-box-line" />
      <span class="text">{{ text }}</span>
    </a>
    <span v-else>-</span>
  </div>
</template>
<script setup lang="ts">
interface ComponentProps {
  text: string | null;
  href: string | null;
}

defineProps<ComponentProps>();
</script>
<style lang="scss" scoped>
.linkItem {
  display: inline-block;
  & > .textBox {
    color: var(--el-color-primary);
    transition: color 0.2s;
    &:hover {
      color: var(--el-color-primary-light-5);
    }
    & > .text {
      margin-left: 4px;
      cursor: pointer;
    }
  }
}
</style>
