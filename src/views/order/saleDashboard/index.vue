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
import { ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { getSaleDashboard, SaleDashboardProps } from '@/api/order/saleDashboard';

const filterValue = ref<Partial<config.FilterDto>>({
  platform: 'walmart'
});
const loading = shallowRef(false);
const tableData = shallowRef<SaleDashboardProps[]>([]);
const page = shallowRef(PAGE);
const page_size = shallowRef(PAGE_SIZE);
const total = shallowRef(0);

const getListFun = async () => {
  try {
    const { data } = await getSaleDashboard({
      page: page.value,
      page_size: page_size.value,
      ...filterValue.value
    });
    tableData.value = data?.list || [];
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  }
};

getListFun();
</script>
<style lang="scss" scoped></style>
