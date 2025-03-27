<template>
  <div v-if="loading" v-loading="loading" class="loading" style="height: 160px" />
  <div ref="target" class="echart" />
</template>
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { EChartsOption } from 'echarts';
import { useEcharts } from '@/hooks/useEcharts';
import moment from 'moment-timezone';
const target = ref<HTMLElement>();

interface ComponentProps {
  loading: boolean;
  xData: string[];
  listingData: number[];
  removeData: number[];
}

const props = defineProps<ComponentProps>();

const renderChart = () => {
  const { setOptions } = useEcharts(target);
  const options: EChartsOption = {
    initOptions: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        show: false,
        lineStyle: {
          color: '#eaeaea',
          width: 0
        }
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      axisLine: {
        show: true,
        lineStyle: {
          color: '#eaeaea'
        }
      },
      axisLabel: {
        color: '#999'
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true
      },
      data: props.xData.map((item) => moment(item).format('MM-DD'))
    },
    grid: {
      top: '0px',
      left: '18px',
      right: '18px',
      bottom: '0%',
      containLabel: true
    },
    yAxis: {
      type: 'value',
      min: Math.min(...[...props.listingData, ...props.removeData]),
      axisLabel: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: '上架总数',
        data: props.listingData,
        type: 'line',
        symbolSize: 0,
        smooth: true,
        emphasis: {
          disabled: true
        },
        lineStyle: {
          color: '#409EFF'
        },
        areaStyle: {
          color: '#409EFF',
          opacity: 0.05
        }
      },
      {
        name: '下架总数',
        data: props.removeData,
        type: 'line',
        symbolSize: 0,
        smooth: true,
        emphasis: {
          disabled: true
        },
        lineStyle: {
          color: '#eaeaea'
        },
        itemStyle: {
          color: '#eaeaea'
        },
        areaStyle: {
          color: '#dadbe0',
          opacity: 0.2
        }
      }
    ]
  };
  setOptions(options);
};

watch(
  () => props.listingData,
  (nV) => {
    if (nV && nV.length) {
      nextTick(() => {
        renderChart();
      });
    }
  },
  {
    immediate: true,
    deep: true
  }
);
</script>
<style lang="scss" scoped>
.loading {
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
.echart {
  width: 100%;
  height: 160px;
  padding: 16px;
  box-sizing: border-box;
}
</style>
