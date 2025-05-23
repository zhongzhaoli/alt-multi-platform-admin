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
        @sort-change="sortChange"
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
import { GetListDto, getPerformanceList, PerformanceProps } from '@/api/performance/walmart';
import moment from 'moment-timezone';

defineOptions({
  name: 'PerformanceWalmart'
});

const filterValue = ref<Partial<config.FilterDto>>({});
const tableData = shallowRef<PerformanceProps[]>([]);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const loading = shallowRef(false);
const getListFun = async () => {
  loading.value = true;
  try {
    const searchParams: GetListDto = {
      ...filterValue.value,
      page: page.value,
      page_size: pageSize.value
    };
    if (sortOrder.value) {
      searchParams.sort = JSON.stringify(sortOrder.value);
    }
    const { data } = await getPerformanceList(searchParams);
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

// 排序条件变化
const sortOrder = shallowRef<{ [key: string]: 'DESC' | 'ASC' } | null>(null);
const sortChange = (data: { column: any; prop: string; order: any }) => {
  if (!data.order) {
    sortOrder.value = null;
  } else {
    sortOrder.value = {
      [data.prop]: data.order === 'ascending' ? 'ASC' : 'DESC'
    };
  }
  getListFun();
};

getListFun();
</script>
<style lang="scss" scoped></style>
