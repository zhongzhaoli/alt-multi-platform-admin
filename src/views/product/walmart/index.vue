<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      >
        <!-- <template #shopId="{ form, row }"> -->
        <!-- <SelectWalmartStore v-model="form[row.prop]" @change="getListFun" /> -->
        <!-- </template> -->
      </FilterContainer>
    </div>
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true,
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
          <div class="frequencyText">更新频率：每 6 个小时</div>
        </template>
        <template #table-shopId="{ row }">
          <RenderCopyIcon :text="row.shopId" type="primary" title="店铺ID" margin="r" />{{
            row.shopId
          }}
        </template>
        <template #table-productInfo="{ row }">
          <ProductItem
            class="productItem"
            type="ordinary"
            :size="60"
            :image-url="row.productImageUrl"
            :product-name="row.productName"
            :desc-list="[
              {
                text: row.productId,
                prefix: 'ID'
              },
              {
                text: row.productSku,
                prefix: 'SKU'
              }
            ]"
          />
        </template>
        <template #table-stockWarning="{ row }">
          <el-tag
            disable-transitions
            effect="plain"
            :type="row.stockWarning ? 'primary' : 'danger'"
          >
            {{ row.stockWarning ? '库存正常' : '库存低于 5 个' }}
          </el-tag>
        </template>
        <template #table-asin="{ row }">
          <TextEllipsis :text="row.asin" :line="2" />
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from '@/components/FilterContainer/index.vue';
import TsxElementTable from 'tsx-element-table';
// import SelectWalmartStore from '@/components/SelectWalmartStore/index.vue';
import * as config from './config';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { ref, shallowRef } from 'vue';
import {
  getWalmartProductList,
  type WalmartProductFilterProps,
  type WalmartProductProps
} from '@/api/product/walmart';
import ProductItem from '@/components/ProductItem/index.vue';
import { RenderCopyIcon } from '@/utils';

const filterValue = ref<Partial<WalmartProductFilterProps>>({});
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const tableData = shallowRef<WalmartProductProps[]>([]);
const loading = shallowRef(false);
const total = shallowRef(0);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getWalmartProductList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filterValue.value
    });
    tableData.value = data?.data || [];
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
getListFun();
</script>
<style lang="scss" scoped></style>
