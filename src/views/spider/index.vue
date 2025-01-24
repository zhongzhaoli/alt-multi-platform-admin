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
        @table-refresh="getListFun"
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
import { ref, shallowRef, watch } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { shortcuts } from '@/config/dateRange';
import { GetSpiderDto, getSpiderList, type SpiderProps } from '@/api/spider/index';
import moment from 'moment-timezone';

interface CustomSpiderProps extends SpiderProps {
  req_total: number;
}

const tableData = shallowRef<CustomSpiderProps[]>([]);
const loading = shallowRef(false);
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);

const dateRange = ref([]);

watch(dateRange, () => {
  getListFun();
});

const getListFun = async () => {
  try {
    let searchParams: GetSpiderDto = {
      page: currentPage.value,
      page_size: pageSize.value
    };
    if (dateRange.value && dateRange.value.length) {
      searchParams = {
        ...searchParams,
        start_date: moment(dateRange.value[0]).format('YYYY-MM-DD'),
        end_date: moment(dateRange.value[1]).format('YYYY-MM-DD')
      };
    }
    const { data } = await getSpiderList(searchParams);
    tableData.value = (data?.list || []).map((item) => {
      return {
        ...item,
        req_total: (item.req_200 || 0) + (item.req_captcha || 0)
      };
    });
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  }
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
