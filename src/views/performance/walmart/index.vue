<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      >
        <template #shop_id="{ form, row }">
          <SelectWalmartStore v-model="form[row.prop]" multiple @change="getListFun" />
        </template>
      </FilterContainer>
    </div>
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :table="{ data: tableData, border: true, loading }"
        :handle="{ show: true }"
        :pagination="{ total }"
        @table-refresh="getListFun"
        @page-change="getListFun"
      >
        <template #handle-left>
          <span class="frequencyText">更新频率：实时更新</span>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from '@/components/FilterContainer/index.vue';
import SelectWalmartStore from '@/components/SelectWalmartStore/index.vue';
import TsxElementTable from 'tsx-element-table';
import * as config from './config';
import { ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { getPerformanceList, PerformanceProps } from '@/api/performance';
import moment from 'moment-timezone';

const filterValue = ref<Partial<config.FilterDto>>({});
const tableData = shallowRef<PerformanceProps[]>([]);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const loading = shallowRef(false);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getPerformanceList({
      page: page.value,
      page_size: pageSize.value,
      ...filterValue.value
    });
    tableData.value = (data?.list || []).map((item: any) => {
      return {
        ...item,
        update_time: item.update_time ? moment(item.update_time).format('YYYY-MM-DD HH:mm:ss') : '-'
      };
    });
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
