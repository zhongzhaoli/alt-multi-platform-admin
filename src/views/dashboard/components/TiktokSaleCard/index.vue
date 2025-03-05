<template>
  <div class="walmartBox cardBox">
    <div class="titleBox">
      <div class="title flex-center">TikTok 销量看板</div>
      <el-button type="primary" link>刷新数据</el-button>
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
import { TableColumnCtx } from 'element-plus';
import { sum } from 'lodash-es';

interface SaleProps {
  shop_id: string;
  shop_name: string;
  sale: number;
  in_sale: number;
  in_sale_product: number;
}

const tableData = ref<SaleProps[]>([
  {
    shop_id: '101637284',
    shop_name: 'Wuxiaoyan',
    sale: 67,
    in_sale: 631.29,
    in_sale_product: 76
  },
  {
    shop_id: '102692328',
    shop_name: 'Zhangaihe',
    sale: 62,
    in_sale: 636.11,
    in_sale_product: 35
  },
  {
    shop_id: '101662134',
    shop_name: 'junfang',
    sale: 42,
    in_sale: 367.84,
    in_sale_product: 21
  },
  {
    shop_id: '102692244',
    shop_name: 'Pengchengming',
    sale: 41,
    in_sale: 200.21,
    in_sale_product: 2
  }
]);
const loading = shallowRef(false);

interface SummaryMethodProps<T = SaleProps> {
  columns: TableColumnCtx<T>[];
  data: T[];
}
const getSummaries = (param: SummaryMethodProps) => {
  const { data } = param;
  return [
    '汇总',
    sum(data.map((v) => v.in_sale_product)),
    sum(data.map((v) => v.sale)),
    `$ ${parseFloat(sum(data.map((v) => v.in_sale)).toFixed(2))}`
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
