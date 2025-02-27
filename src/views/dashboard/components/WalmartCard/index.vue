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
            loading
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
import { ref, shallowRef } from 'vue';
import moment from 'moment-timezone';
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

// 获取当前日期
const today = moment();
// 初始化一个数组来存储日期
const last7Days = ref<string[]>([]);
// 循环生成最近 7 天的日期
for (let i = 0; i < 7; i++) {
  const date = today.clone().subtract(i, 'days'); // 从当前日期往前推 i 天
  last7Days.value.unshift(date.format('YYYY-MM-DD')); // 格式化日期并添加到数组
}

const chartLoading = shallowRef(false);
const upload_products = shallowRef<number[]>([]);
const remove_products = shallowRef<number[]>([]);
const getSeventSummaryFun = async () => {
  chartLoading.value = true;
  try {
    const { data } = await getWalmartSevenDaysSummary({
      start_date: last7Days.value[0],
      end_date: last7Days.value[last7Days.value.length - 1]
    });
    remove_products.value = data.map((item) => item.download_products);
    upload_products.value = data.map((item) => item.upload_products);
  } catch (err) {
    console.log(err);
  } finally {
    chartLoading.value = false;
  }
};

getSeventSummaryFun();
getSummaryFun();
</script>
<style lang="scss" scoped>
.walmartBox {
  & > .body {
    position: relative;
    & > .tableBox {
      height: 300px;
    }
  }
}
</style>
