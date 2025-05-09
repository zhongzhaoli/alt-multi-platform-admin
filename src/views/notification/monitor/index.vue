<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      />
    </div>
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true,
          loading
        }"
        :handle="{
          show: true
        }"
        :pagination="{
          total
        }"
        @page-change="getListFun"
        @table-refresh="getListFun"
      >
        <template #handle-left>
          <div class="frequencyText">更新时间：实时监控更新</div>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  getMonitorNotificationList,
  FilterDto,
  MonitorNotificationProps
} from '@/api/notification/monitor';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import FilterContainer from '@/components/FilterContainer/index.vue';
import TsxElementTable from 'tsx-element-table';
import { ref, shallowRef } from 'vue';
import * as config from './config';
import moment from 'moment-timezone';

defineOptions({
  name: 'NotificationMonitor'
});

const filterValue = ref<Partial<FilterDto>>({});
const loading = shallowRef(false);
const tableData = shallowRef<MonitorNotificationProps[]>([]);
const page = shallowRef(PAGE);
const total = shallowRef(0);
const pageSize = shallowRef(PAGE_SIZE);

const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getMonitorNotificationList({
      page: page.value,
      page_size: pageSize.value,
      ...filterValue.value
    });
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      created_at: moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
    }));
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

getListFun();
</script>
<style lang="scss" scoped></style>
