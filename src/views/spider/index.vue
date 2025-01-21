<template>
  <div class="container">
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          loading,
          border: true
        }"
        :handle="{
          show: true
        }"
        :pagination="{
          total
        }"
        @table-refres="getListFun"
        @page-change="getListFun"
      >
        <template #handle-left>
          <div class="dateRangeBox">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              :shortcuts="shortcuts"
              @change="getListFun"
            />
          </div>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import * as config from './config';
import { ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { shortcuts } from '@/config/dateRange';

const tableData = shallowRef<any[]>([]);
const loading = shallowRef(false);
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);

const dateRange = ref([]);

const getListFun = () => {
  tableData.value = [
    {
      date: '2024-01-21',
      spider_total: 84434,
      success_total: 81305,
      fail_total: 3129,
      fail_rate: `${((3129 / 84434) * 100).toFixed(2)}%`,
      success_rate: `${((81305 / 84434) * 100).toFixed(2)}%`
    },
    {
      date: '2024-01-20',
      spider_total: 338019,
      success_total: 315040,
      fail_total: 22979,
      fail_rate: `${((22979 / 338019) * 100).toFixed(2)}%`,
      success_rate: `${((315040 / 338019) * 100).toFixed(2)}%`
    }
  ];
};
getListFun();
</script>
<style lang="scss" scoped>
.container {
  & > .tableBox {
    margin-top: 0;
    & .dateRangeBox {
      width: 240px;
      &:deep(.el-date-editor) {
        font-size: 12px;
        width: 100%;
      }
      * {
        font-size: 13px;
      }
    }
  }
}
</style>
