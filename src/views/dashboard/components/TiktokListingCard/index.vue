<template>
  <div class="tiktokBox cardBox">
    <div class="titleBox">
      <div class="title flex-center">Tiktok 上架看板</div>
      <el-button link type="primary" @click="toDetail">查看详情</el-button>
    </div>
    <div class="body">
      <ListingEchart
        :x-data="['02-21', '02-22', '02-23', '02-24', '02-25', '02-26', '02-27']"
        :listing-data="[2000, 2200, 3900, 2801, 2931, 2199, 3200]"
        :remove-data="[1000, 1200, 2000, 1800, 1510, 1200, 1400]"
        :loading="false"
      />
      <div class="tableBox">
        <TsxElementTable
          :table-columns="tableColumns"
          :table="{
            data: tableData,
            border: true,
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
import { tableColumns } from './config';
import { TableColumnCtx } from 'element-plus';
import { sum } from 'lodash-es';
import { ref } from 'vue';
const router = useRouter();

const toDetail = () => {
  router.push('/listing');
};

const tableData = ref<any>([
  {
    shop_name: 'Wuxiaoyan',
    upload_products: 2000,
    download_products: 1000,
    reupload_products: 100
  }
]);

interface SummaryMethodProps<T = any> {
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
.tiktokBox {
  & > .body {
    position: relative;
    & > .tableBox {
      height: 400px;
    }
  }
}
</style>
