<template>
  <div class="walmartBox cardBox">
    <div class="titleBox">
      <div class="title flex-center">TikTok 销量看板</div>
      <div>
        <el-button type="primary" link @click="getListFun">
          <el-button type="info" link @click="getListFun">
            <el-icon><Refresh /></el-icon>
          </el-button>
        </el-button>
        <el-button type="primary" link @click="toDetail">查看详情</el-button>
      </div>
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
import { useRouter } from 'vue-router';
import { Refresh } from '@element-plus/icons-vue';

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
    totalData.value.today_total_sales || 0,
    `$ ${(totalData.value.today_total_sales_amount || 0).toFixed(2)}`
  ];
};

const router = useRouter();
const toDetail = () => {
  router.push({ path: '/order/saleDashboard', query: { type: 'tiktok' } });
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
