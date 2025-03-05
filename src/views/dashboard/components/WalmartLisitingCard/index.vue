<template>
  <div class="walmartBox cardBox">
    <div class="titleBox">
      <div class="title flex-center">Walmart 上架看板</div>
      <el-button link type="primary" @click="toDetail">查看详情</el-button>
    </div>
    <div class="body">
      <ListingEchart
        :x-data="last7Days"
        :listing-data="upload_products"
        :remove-data="remove_products"
        :loading="chartLoading"
      />
      <div class="tableBox">
        <TsxElementTable
          :table-columns="tableColumns"
          :table="{
            data: summaryList,
            border: true,
            loading,
            showSummary: true,
            summaryMethod: getSummaries
          }"
          :pagination="{
            show: false
          }"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import ListingEchart from './ListingEchart.vue';
import TsxElementTable from 'tsx-element-table';
import {
  getWalmartListingSummary,
  type WalmartListingSummaryProps,
  getWalmartSevenDaysSummary
} from '@/api/dashboard/index';
import { tableColumns } from './config';
import { shallowRef } from 'vue';
import { cloneDeep, sum } from 'lodash-es';
import { getLastSeventDays } from '../../utils';
import { TableColumnCtx } from 'element-plus';
const router = useRouter();

const toDetail = () => {
  router.push('/listing');
};

const summaryList = shallowRef<WalmartListingSummaryProps[]>([]);
const loading = shallowRef(false);
const getSummaryFun = async () => {
  loading.value = true;
  try {
    const { data } = await getWalmartListingSummary();
    summaryList.value = data || [];
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const last7Days = getLastSeventDays();

const chartLoading = shallowRef(false);
const upload_products = shallowRef<number[]>([]);
const remove_products = shallowRef<number[]>([]);
const getSeventSummaryFun = async () => {
  chartLoading.value = true;
  try {
    const { data } = await getWalmartSevenDaysSummary({
      start_date: last7Days[0],
      end_date: last7Days[last7Days.length - 1]
    });
    let uList: number[] = [];
    let rList: number[] = [];
    last7Days.forEach((item, index) => {
      const currentIndex = data.findIndex((i) => i.date === item);
      if (currentIndex !== -1) {
        uList[index] = data[currentIndex].upload_products;
        rList[index] = data[currentIndex].download_products;
      } else {
        uList[index] = 0;
        rList[index] = 0;
      }
    });
    upload_products.value = cloneDeep(uList);
    remove_products.value = cloneDeep(rList);
  } catch (err) {
    console.log(err);
  } finally {
    chartLoading.value = false;
  }
};

getSeventSummaryFun();
getSummaryFun();

interface SummaryMethodProps<T = WalmartListingSummaryProps> {
  columns: TableColumnCtx<T>[];
  data: T[];
}
const getSummaries = (param: SummaryMethodProps) => {
  const { data } = param;
  return [
    '汇总',
    sum(data.map((v) => v.upload_products)),
    sum(data.map((v) => v.download_products)),
    sum(data.map((v) => v.reupload_products || 0))
  ];
};
</script>
<style lang="scss" scoped>
.walmartBox {
  & > .body {
    & > .tableBox {
      height: 400px;
    }
  }
}
</style>
