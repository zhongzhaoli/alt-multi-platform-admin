<template>
  <div class="walmartBox cardBox">
    <div class="titleBox">
      <div class="title flex-center">Walmart 销量看板</div>
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
  },
  {
    shop_id: '101620287',
    shop_name: 'Niuyuewen',
    sale: 40,
    in_sale: 263.64,
    in_sale_product: 46
  },
  {
    shop_id: '101642534',
    shop_name: 'Dengyonqin',
    sale: 33,
    in_sale: 197.98,
    in_sale_product: 11
  },
  {
    shop_id: '101663218',
    shop_name: 'lishaojun',
    sale: 17,
    in_sale: 175.99,
    in_sale_product: 48
  },
  {
    shop_id: '101620292',
    shop_name: 'jiaoying',
    sale: 9,
    in_sale: 293.01,
    in_sale_product: 66
  },
  {
    shop_id: '102721729',
    shop_name: 'Wanglijie',
    sale: 19,
    in_sale: 299.99,
    in_sale_product: 101
  },
  {
    shop_id: '102721713',
    shop_name: 'Xusansan',
    sale: 19,
    in_sale: 440.44,
    in_sale_product: 22
  },
  {
    shop_id: '101554526',
    shop_name: 'XUNXUNKEJI',
    sale: 1,
    in_sale: 99.29,
    in_sale_product: 77
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
