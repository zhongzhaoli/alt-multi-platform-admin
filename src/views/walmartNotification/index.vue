<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer v-model="filterValue" :columns="config.filterColumns">
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
      >
        <template #handle-left>
          <span class="testText"> PS：测试数据 </span>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
import SelectWalmartStore from '@/components/SelectWalmartStore/index.vue';
import * as config from './config';
import { shallowRef, ref } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';

const filterValue = ref<Partial<config.FilterDto>>({});
const tableData = shallowRef([
  {
    shop_name: 'Pengchengming',
    message: true,
    notification: false,
    created_at: '2021-09-01 12:00:00'
  },
  {
    shop_name: 'XUNXUNKEJI',
    message: false,
    notification: false,
    created_at: '2021-09-01 12:00:00'
  }
]);
const loading = shallowRef(false);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = 0;
const getListFun = async () => {};

getListFun();
</script>
<style lang="scss" scoped>
.container {
  & > .tableBox {
    & .testText {
      font-size: 13px;
      color: #999;
      padding-left: 4px;
    }
  }
}
</style>
