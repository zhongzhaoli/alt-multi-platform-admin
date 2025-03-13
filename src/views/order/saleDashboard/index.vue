<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      />
    </div>
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="page"
        v-model:page-size="page_size"
        :table-columns="config.tableColumns"
        :table="{
          border: true,
          data: tableData,
          loading
        }"
        :handle="{
          show: true,
          rightColumns: config.handleRightColumns
        }"
        :pagination="{
          total
        }"
        @page-change="getListFun"
        @table-refresh="getListFun"
      >
        <template #handle-left>
          <div class="handleLeftBox d-flex align-center">
            <!-- <el-button type="warning" @click="multipleDeliver"> 批量发货 </el-button> -->
            <!-- <div class="vr" /> -->
            <div class="frequencyText">更新频率：每天 0 点</div>
          </div>
        </template>
        <template #table-product_info="{ row }">
          <ProductItem
            class="productItem"
            :image-url="row.product_image_url"
            :product-name="row.product_name"
            :size="50"
            :desc-list="[
              {
                text: row.product_sku,
                prefix: 'SKU'
              },
              {
                text: row.product_id,
                prefix: 'Product Id'
              }
            ]"
          />
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
import ProductItem from '@/components/ProductItem/index.vue';
import * as config from './config';
import { ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';

const filterValue = ref<Partial<config.FilterDto>>({
  platform: 'walmart'
});
const loading = shallowRef(false);
const tableData = shallowRef([
  {
    product_image_url:
      'https://i5.walmartimages.com/asr/242ef7f3-b53b-4416-8a80-0df44bc5a505.688073380db78431cd179414a11b41c6.jpeg',
    product_name: 'Quilted Handbag Purse Shoulder Bag Pocketbook',
    product_sku: 'GDGXN6FBBJ_M71B6B83_3',
    product_id: '15425952727',
    shop_name: 'Pengchengming',
    sold_num: 99,
    paid_amount: 2910.99,
    per_order_amount: 29.99,
    buyer_num: 96,
    shipping_fee: 3.45,
    tax_fee: 0.05,
    refund_num: 9,
    refund_rate: 0.09
  }
]);
const page = shallowRef(PAGE);
const page_size = shallowRef(PAGE_SIZE);
const total = shallowRef(0);

const getListFun = () => {};
</script>
<style lang="scss" scoped></style>
