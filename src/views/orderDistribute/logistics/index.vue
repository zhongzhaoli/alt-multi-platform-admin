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
        :table="{ border: true, data: tableData, loading }"
        :handle="{ show: true }"
        :pagination="{ total }"
        @table-refresh="getListFun"
        @page-change="getListFun"
      >
        <template #handle-left>
          <el-button type="primary" @click="getExcellent">获取最优解</el-button>
        </template>
        <template #table-tracking_number="{ row }">
          <div class="inline-flex">
            <RenderCopyIcon :text="row.tracking_number" title="物流追踪号" />
            {{ row.tracking_number || '-' }}
          </div>
        </template>
        <template #table-postal_code="{ row }">
          <div class="inline-flex">
            <RenderCopyIcon :text="row.postal_code" title="邮编" />
            {{ row.postal_code || '-' }}
          </div>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PAGE, PAGE_SIZE } from '@/constants/app';
import FilterContainer from '@/components/FilterContainer/index.vue';
import TsxElementTable from 'tsx-element-table';
import { onBeforeUnmount, ref, shallowRef, unref } from 'vue';
import {
  getLogisticsList,
  GetLogisticsListDto,
  LogisticsProps,
  getExcellentFile
} from '@/api/orderDistribute/logistics';
import * as config from './config';
import { downloadCore, RenderCopyIcon } from '@/utils';
import { useFullLoading } from '@/hooks/useFullLoading';
import axios, { CancelTokenSource } from 'axios';

const filterValue = ref<Partial<config.FilterDto>>({});
const tableData = shallowRef<LogisticsProps[]>([]);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const loading = shallowRef(false);
const total = shallowRef(0);

const getListFun = async () => {
  loading.value = true;
  try {
    const searchParams: GetLogisticsListDto = {
      page: page.value,
      page_size: pageSize.value
    };
    if (
      'start_ship_date' in unref(filterValue) &&
      'end_ship_date' in unref(filterValue) &&
      unref(filterValue).start_ship_date &&
      unref(filterValue).end_ship_date
    ) {
      searchParams.ship_date = JSON.stringify([
        unref(filterValue).start_ship_date,
        unref(filterValue).end_ship_date
      ]);
    }
    if (
      'start_delivery_date' in unref(filterValue) &&
      'end_delivery_date' in unref(filterValue) &&
      unref(filterValue).start_delivery_date &&
      unref(filterValue).end_delivery_date
    ) {
      searchParams.delivery_date = JSON.stringify([
        unref(filterValue).start_delivery_date,
        unref(filterValue).end_delivery_date
      ]);
    }
    if ('postal_code' in unref(filterValue) && unref(filterValue).postal_code) {
      searchParams.postal_code = unref(filterValue).postal_code;
    }
    const { data } = await getLogisticsList(searchParams);
    tableData.value = data?.list || [];
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

// 获取最优解
const fullLoading = useFullLoading();
const cancelToken = axios.CancelToken;
let source: CancelTokenSource;
const getExcellent = async () => {
  fullLoading.open();
  try {
    source = cancelToken.source();
    const data = await getExcellentFile(source.token);
    downloadCore(data, '物流信息最优解.xlsx');
  } catch (err) {
    console.log(err);
  } finally {
    fullLoading.close();
  }
};

getListFun();

onBeforeUnmount(() => {
  source && source.cancel('请求取消');
});
</script>
<style lang="scss" scoped></style>
