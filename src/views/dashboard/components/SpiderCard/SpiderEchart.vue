<template>
  <div v-if="loading" v-loading="loading" class="loading" style="height: 300px" />
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
  tableData: number[];
}

const props = defineProps<ComponentProps>();

const renderChart = () => {
  const { setOptions } = useEcharts(target);
  const options: EChartsOption = {
    initOptions: {},
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: '#eaeaea'
        }
      }
    },
    xAxis: {
      type: 'category',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#999',
          width: 0.2
        }
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: '#999',
          width: 0.2
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#999',
          width: 0.2
        }
      },
      data: props.xData.map((item) => moment(item).format('MM-DD'))
    },
    grid: {
      top: '20px',
      left: '0px',
      right: '1px',
      bottom: '0%',
      containLabel: true
    },
    yAxis: {
      type: 'value',
      scale: true,
      minInterval: 1,
      axisLabel: {
        show: true
      }
    },
    series: [
      {
        name: '成功次数',
        data: props.tableData,
        type: 'line',
        symbolSize: 6,
        lineStyle: {
          color: '#409EFF'
        },
        label: {
          show: true,
          position: 'top',
          color: '#999',
          fontSize: 12,
          formatter: '{c}'
        }
      }
    ]
  };
  setOptions(options);
};

watch(
  () => props.tableData,
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
  height: 300px;
  padding: 0 16px 16px 16px;
  box-sizing: border-box;
}
</style>
