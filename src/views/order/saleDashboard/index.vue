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
          showSummary: true,
          summaryMethod,
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
        @sort-change="sortChange"
      >
        <template #handle-left>
          <div class="handleLeftBox d-flex align-center">
            <div class="frequencyText">更新频率：每 2 个小时</div>
          </div>
        </template>
        <template #table-product_info="{ row }">
          <ProductItem
            class="productItem"
            :image-url="row.image_url"
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
import { h, ref, shallowRef, unref } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import {
  getSaleDashboard,
  GetSaleDashboardDto,
  SaleDashboardProps,
  SaleDashboardSummaryProps
} from '@/api/order/saleDashboard';
import PriceItem from '@/views/finance/storeBalance/components/PriceItem.vue';

const filterValue = ref<Partial<config.FilterDto>>({
  platform: 'walmart'
});
const loading = shallowRef(false);
const tableData = shallowRef<SaleDashboardProps[]>([]);
const page = shallowRef(PAGE);
const page_size = shallowRef(PAGE_SIZE);
const total = shallowRef(0);

const summaryData = ref<SaleDashboardSummaryProps>({
  all_buyer_number: 0,
  all_cancelled_proportion: 0,
  all_cancelled_quantity: 0,
  all_pay_amount: 0,
  all_pay_quantity: 0,
  all_product_tax: 0,
  all_refund_proportion: 0,
  all_refund_quantity: 0,
  all_shipping_amount: 0,
  all_shipping_tax: 0,
  all_per_order_amount: 0
});
const summaryMethod = () => {
  return [
    '-',
    '汇总',
    unref(summaryData).all_pay_quantity || 0,
    h(PriceItem, {
      price: unref(summaryData).all_pay_amount || 0
    }),
    h(PriceItem, {
      price: unref(summaryData).all_per_order_amount || 0
    }),
    unref(summaryData).all_buyer_number || 0,
    h(PriceItem, {
      price: unref(summaryData).all_shipping_amount || 0
    }),
    h(PriceItem, {
      price: unref(summaryData).all_shipping_tax || 0
    }),
    h(PriceItem, {
      price: unref(summaryData).all_product_tax || 0
    }),
    unref(summaryData).all_cancelled_quantity || 0,
    `${(unref(summaryData).all_cancelled_proportion || 0).toFixed(2)}%`,
    unref(summaryData).all_refund_quantity || 0,
    `${(unref(summaryData).all_refund_proportion || 0).toFixed(2)}%`
  ];
};

// 排序条件变化
const sortOrder = shallowRef<{ [key: string]: 'DESC' | 'ASC' } | null>(null);
const sortChange = (data: { column: any; prop: string; order: any }) => {
  if (!data.order) {
    sortOrder.value = null;
  } else {
    sortOrder.value = {
      [data.prop]: data.order === 'ascending' ? 'ASC' : 'DESC'
    };
  }
  getListFun();
};

const getListFun = async () => {
  try {
    const searchParams: GetSaleDashboardDto = {
      page: page.value,
      page_size: page_size.value,
      ...filterValue.value
    };
    if (sortOrder.value) {
      searchParams.sort = JSON.stringify(sortOrder.value);
    }
    const { data } = await getSaleDashboard(searchParams);
    tableData.value = data?.list || [];
    total.value = data?.total || 0;
    summaryData.value = data?.all_dict || {
      all_buyer_number: 0,
      all_cancelled_proportion: 0,
      all_cancelled_quantity: 0,
      all_pay_amount: 0,
      all_pay_quantity: 0,
      all_product_tax: 0,
      all_refund_proportion: 0,
      all_refund_quantity: 0,
      all_shipping_amount: 0,
      all_shipping_tax: 0,
      all_per_order_amount: 0
    };
  } catch (err) {
    console.log(err);
  }
};

getListFun();
</script>
<style lang="scss" scoped></style>
