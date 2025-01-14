<template>
  <div class="countNumberCard">
    <div class="title">{{ title }}</div>
    <div class="numberText">
      <CountUp :end-val="count" separator="," :decimals="decimals" :prefix="countPrefix" />
    </div>
  </div>
</template>
<script setup lang="ts">
import CountUp from '@/components/CountUp/index.vue';
interface ComponentProps {
  title: string;
  count: number;
  countPrefix?: string;
  decimals?: number;
}
withDefaults(defineProps<ComponentProps>(), {
  decimals: 2
});
</script>
<style lang="scss" scoped>
.countNumberCard {
  border: 1px #eaeaea solid;
  border-radius: 4px;
  padding: var(--normal-padding) 16px;
  & > .title {
    font-size: 14px;
    color: #616161;
  }
  & > .numberText {
    font-size: 18px;
    font-weight: 500;
    color: #4a4a4a;
    margin-top: 8px;
  }
}
</style>
