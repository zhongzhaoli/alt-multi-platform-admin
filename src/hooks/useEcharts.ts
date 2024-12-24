import * as echarts from 'echarts';
import { EChartsOption, ECharts } from 'echarts';
import { useWindowSizeFn } from './useWindowSizeFn';
import { Ref, unref } from 'vue';
import { tryOnBeforeUnmount } from '@vueuse/core';

export function useEcharts(dom: Ref<HTMLElement | undefined>) {
  let chart: ECharts;
  const init = () => {
    const el = unref(dom);
    if (!el || !unref(el)) {
      return;
    }
    chart = echarts.init(el);
    const { addListener } = useWindowSizeFn();
    if (chart) {
      addListener(() => {
        chart.resize({
          animation: {
            duration: 300,
            easing: 'quadraticIn'
          }
        });
      });
    }
  };
  init();

  const setOptions = (options: EChartsOption) => {
    chart && chart.setOption(options);
  };

  tryOnBeforeUnmount(() => {
    chart && chart.clear();
  });

  return { init, setOptions };
}
