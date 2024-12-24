<template>
  <div ref="target" class="echart" />
</template>
<script setup lang="ts">
import { watchEffect, Ref, ref, unref } from 'vue';
import * as echarts from 'echarts';
import { useEcharts } from '@/hooks/useEcharts';
const target = ref<HTMLElement | null>(null);
const props = defineProps<{
  options: echarts.EChartsOption;
}>();
const renderChart = () => {
  const { setOptions } = useEcharts(target as Ref<HTMLElement>);
  setOptions(props.options);
};

watchEffect(() => {
  if (props.options && unref(target)) {
    renderChart();
  }
});
</script>
<style lang="scss" scoped>
.echart {
  width: 100%;
  height: 100%;
}
</style>
