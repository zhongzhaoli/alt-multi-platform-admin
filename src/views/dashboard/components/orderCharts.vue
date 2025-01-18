<template>
  <div class="chartBox">
    <div ref="target" class="echart" />
  </div>
</template>
<script setup lang="ts">
import { type EChartsOption } from 'echarts';
import { watchEffect, shallowRef, ShallowRef, unref } from 'vue';
import { useEcharts } from '@/hooks/useEcharts';
const target = shallowRef<HTMLElement | null>(null);
const props = defineProps<{
  options: EChartsOption;
}>();
const renderChart = () => {
  const { setOptions } = useEcharts(target as ShallowRef<HTMLElement>);
  setOptions(props.options);
};

watchEffect(() => {
  if (props.options && unref(target)) {
    renderChart();
  }
});
</script>
<style lang="scss" scoped>
.chartBox {
  height: 100%;
  width: 100%;
  & > .echart {
    width: 100%;
    height: 100%;
  }
}
</style>
