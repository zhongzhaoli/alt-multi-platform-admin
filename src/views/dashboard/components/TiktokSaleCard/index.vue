<template>
  <div class="walmartBox cardBox">
    <div class="titleBox">
      <div class="title flex-center">TikTok 销量看板</div>
      <el-button type="primary" link @click="getListFun">刷新数据</el-button>
    </div>
    <div class="body">
      <div class="tableBox">
        <TsxElementTable
          :table-columns="tableColumns"
          :table="{
            data: tableData,
            border: true,
            loading,
            showSummary: true,
            summaryMethod: getSummaries
          }"
          :pagination="{ show: false }"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import { tableColumns } from './config';
import { ref, shallowRef } from 'vue';
import {
  getTiktokOrderSummary,
  OrderSummaryProps,
  OrderSummaryTotalProps
} from '@/api/dashboard/index';
import moment from 'moment-timezone';

const tableData = ref<OrderSummaryProps[]>([]);
const totalData = ref<OrderSummaryTotalProps>({
  today_total_sales: 0,
  today_total_sales_amount: 0
});
const loading = shallowRef(false);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getTiktokOrderSummary({
      date: moment().format('YYYY-MM-DD')
    });
    tableData.value = data.daily_summary_data || [];
    if (data.daily_summary_total_data) totalData.value = data.daily_summary_total_data;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getSummaries = () => {
  return [
    '汇总',
    (totalData.value.today_total_sales || 0).toFixed(2),
    `$ ${(totalData.value.today_total_sales_amount || 0).toFixed(2)}`
  ];
};
getListFun();
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
