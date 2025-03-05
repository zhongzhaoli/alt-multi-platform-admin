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

const last7Days = getLastSeventDays();

const tableData = shallowRef<number[]>([]);
// const loading = shallowRef(true);
const getListFun = async () => {
  tableData.value = [2000, 2200, 3900, 2801, 2931, 2199, 3200];
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
