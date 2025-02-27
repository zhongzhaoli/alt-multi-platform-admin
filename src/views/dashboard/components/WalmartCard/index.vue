<template>
  <div class="walmartBox cardBox">
    <div class="titleBox">
      <div class="title flex-center">Walmart 上架看板</div>
      <el-button link type="primary" @click="toDetail">查看详情</el-button>
    </div>
    <div class="body">
      <ListingEchart
        :x-data="['02-21', '02-22', '02-23', '02-24', '02-25', '02-26', '02-27']"
        :listing-data="[1300, 1600, 2600, 2401, 2931, 2199, 1500]"
        :remove-data="[1000, 1200, 2000, 1800, 1510, 1200, 1400]"
        :loading="false"
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
import { getWalmartListingSummary, type WalmartListingSummaryProps } from '@/api/dashboard/index';
import { tableColumns } from './config';
import { shallowRef } from 'vue';
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

getSummaryFun();
</script>
<style lang="scss" scoped>
.walmartBox {
  & > .body {
    & > .tableBox {
      height: 300px;
    }
  }
}
</style>
