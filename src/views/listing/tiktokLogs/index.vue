<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      >
        <template #shop_id="{ row, form, change }">
          <SelectTiktokShop v-model="form[row.prop]" multiple @change="change" />
        </template>
      </FilterContainer>
    </div>
    <div class="tableBox">
      <TsxElementTable
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true,
          loading
        }"
        :pagination="{ total }"
        @page-change="getListFun"
        @table-refresh="getListFun"
        @sort-change="sortChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  getTiktokLogsList,
  type FilterDto,
  TiktokLogsProps,
  GetTiktokLogsDto
} from '@/api/listing/tiktokLogs';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import SelectTiktokShop from '@/components/SelectTiktokStore/index.vue';
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
import { ref, shallowRef, unref } from 'vue';
import * as config from './config';

const filterValue = ref<Partial<FilterDto>>({});
const tableData = shallowRef<TiktokLogsProps[]>([]);
const total = shallowRef(0);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const loading = shallowRef(false);

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

const getListFun = async () => {
  loading.value = true;
  try {
    const searchParams: GetTiktokLogsDto = {
      page: unref(page),
      page_size: unref(pageSize),
      ...unref(filterValue)
    };
    if (sortOrder.value) {
      searchParams.sort = JSON.stringify(sortOrder.value);
    }
    const { data } = await getTiktokLogsList(searchParams);
    tableData.value = data?.list || [];
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
