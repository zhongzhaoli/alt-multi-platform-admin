<template>
  <div class="tiktokBox cardBox">
    <div class="titleBox">
      <div class="title flex-center">Tiktok 上架看板</div>
      <div>
        <el-button link type="primary" @click="toDetail">查看详情</el-button>
        <el-button link type="primary" @click="historicalVisible = true"> 产品类目统计 </el-button>
      </div>
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
            showSummary: true,
            loading,
            summaryMethod: getSummaries
          }"
          :pagination="{
            show: false
          }"
        />
      </div>
    </div>
    <ConfirmDialog
      v-model="historicalVisible"
      width="800px"
      title="产品类目统计"
      class="historicalDialog"
      :show-confirm-btn="false"
      cancel-btn-text="关闭"
    >
      <HistoricalCategoryTable platform="tiktok" />
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
import ListingEchart from './ListingEchart.vue';
import TsxElementTable from 'tsx-element-table';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import HistoricalCategoryTable from '../historicalCategoryTable/index.vue';
import {
  type ListingSummaryProps,
  type ListingSummaryTotalProps,
  getTiktokListingSummary,
  getTiktokSevenDaysSummary
} from '@/api/dashboard/index';
import { tableColumns } from './config';
import { shallowRef } from 'vue';
import { cloneDeep } from 'lodash-es';
import { getLastSeventDays } from '../../utils';
const router = useRouter();

const toDetail = () => {
  router.push({ path: '/listing/dashboard', query: { type: 'tiktok' } });
};

const summaryList = shallowRef<ListingSummaryProps[]>([]);
const summaryTotal = shallowRef<ListingSummaryTotalProps>({
  publish_products: 0,
  unpublish_products: 0,
  sale_products: 0,
  inventory_link_ratio: '0%',
  in_stock_products: 0,
  out_of_stock_products: 0
});
const loading = shallowRef(false);
const getSummaryFun = async () => {
  loading.value = true;
  try {
    const { data } = await getTiktokListingSummary({
      date: last7Days[last7Days.length - 1]
    });
    summaryList.value = data.daily_summary_data || [];
    if (data.daily_summary_total_data) summaryTotal.value = data.daily_summary_total_data;
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
    const { data } = await getTiktokSevenDaysSummary({
      start_date: last7Days[0],
      end_date: last7Days[last7Days.length - 1]
    });
    let uList: number[] = [];
    let rList: number[] = [];
    last7Days.forEach((item, index) => {
      const currentIndex = data.findIndex((i) => i.date === item);
      if (currentIndex !== -1) {
        uList[index] = data[currentIndex].publish_products;
        rList[index] = data[currentIndex].retire_products;
      } else {
        uList[index] = 0;
        rList[index] = 0;
      }
      upload_products.value = cloneDeep(uList);
      remove_products.value = cloneDeep(rList);
    });
  } catch (err) {
    console.log(err);
  } finally {
    chartLoading.value = false;
  }
};

getSeventSummaryFun();
getSummaryFun();

const getSummaries = () => {
  return [
    '汇总',
    summaryTotal.value.sale_products || 0,
    summaryTotal.value.in_stock_products || 0,
    summaryTotal.value.out_of_stock_products || 0,
    summaryTotal.value.inventory_link_ratio || '0%',
    summaryTotal.value.publish_products || 0,
    summaryTotal.value.unpublish_products || 0
  ];
};

// 历史类目
const historicalVisible = shallowRef(false);
</script>
<style lang="scss" scoped>
.tiktokBox {
  & > .body {
    position: relative;
    & > .tableBox {
      height: 400px;
    }
  }
}
</style>
