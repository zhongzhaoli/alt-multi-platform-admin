<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
      />
    </div>
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true,
          loading,
        }"
        :handle="{
          show: true,
          rightColumns: config.handleRightColumns,
        }"
        :pagination="{
          total,
        }"
        @table-refresh="getListFun"
        @page-change="getListFun"
      >
        <template #handle-left>
          <div class="frequencyText">更新频率：每 6 个小时</div>
        </template>
        <template #table-productInfo="{ row }">
          <ProductItem
            :size="60"
            :image-url="row.productImageUrl"
            :product-name="row.productName"
            :desc-list="[
              {
                text: row.productSku,
                prefix: 'SKU：',
              },
              {
                text: row.productAsin,
                prefix: 'ASIN：',
              },
            ]"
          />
        </template>
        <template #table-deliveryMethod="{ row }">
          <el-tag
            disable-transitions
            effect="plain"
            :type="row.deliveryMethod ? 'primary' : 'info'"
          >
            {{ row.deliveryMethod ? "是" : "否" }}
          </el-tag>
        </template>
        <template #table-deliveryTime="{ row }">
          <el-tag
            disable-transitions
            effect="plain"
            :type="row.deliveryTime ? 'primary' : 'info'"
          >
            {{ row.deliveryTime ? "是" : "否" }}
          </el-tag>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from "@/components/FilterContainer/index.vue";
import TsxElementTable from "tsx-element-table";
import * as config from "./config";
import { ref } from "vue";
import { PAGE, PAGE_SIZE } from "@/constants/app";
import {
  getLocalProductList,
  type LocalProductProps,
  type LocalProductFilterProps,
} from "@/api/product/local";
import ProductItem from "@/components/ProductItem/index.vue";

const filterValue = ref<Partial<LocalProductFilterProps>>({});
const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const tableData = ref<LocalProductProps[]>([]);
const loading = ref(false);
const total = ref(0);
const getListFun = async () => {
  loading.value = true;
  try {
    const { datas } = await getLocalProductList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filterValue.value,
    });
    tableData.value = datas?.data || [];
    total.value = datas?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
getListFun();
</script>
<style lang="scss" scoped></style>
