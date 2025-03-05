<template>
  <div class="spiderBox cardBox">
    <div class="titleBox">
      <div class="title flex-center">监控看板</div>
    </div>
    <div class="body">
      <MonitorEchart :table-data="tableData" :x-data="last7Days" :loading="false" />
    </div>
  </div>
</template>
<script setup lang="ts">
import MonitorEchart from './MonitorEchart.vue';
import { shallowRef } from 'vue';
import { getLastSeventDays } from '../../utils';
import { getSpiderList } from '@/api/spider';

const last7Days = getLastSeventDays();

const tableData = shallowRef<number[]>([]);
const loading = shallowRef(true);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getSpiderList({
      page: 1,
      page_size: 100,
      end_date: last7Days[last7Days.length - 1],
      start_date: last7Days[0],
      spider_type: 'monitor'
    });
    const uList: number[] = [];
    last7Days.forEach((item, index) => {
      const currentIndex = (data?.list || []).findIndex((i) => i.crawl_date === item);
      if (currentIndex !== -1) {
        uList[index] = data!.list[currentIndex].req_200;
      } else {
        uList[index] = 0;
      }
    });
    tableData.value = uList;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
getListFun();
</script>
<style lang="scss" scoped>
.spiderBox {
  & > .body {
    position: relative;
  }
}
</style>
