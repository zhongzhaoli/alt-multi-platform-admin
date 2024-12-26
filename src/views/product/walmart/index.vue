<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer :columns="config.filterColumns" />
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
        }"
        :pagination="{
          total,
        }"
      >
        <template #handle-left>
          <div class="frequencyText">更新频率：每 6 个小时</div>
        </template>
        <template #table-shopId="{ row }">
          <RenderCopyIcon
            :text="row.shopId"
            type="primary"
            title="店铺ID"
            margin="r"
          />{{ row.shopId }}
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
                text: row.productSku,
                prefix: 'SKU：',
              },
              {
                text: row.productId,
                prefix: 'ID：',
              },
            ]"
          />
        </template>
        <template #table-stockWarning="{ row }">
          <el-tag
            disable-transitions
            effect="plain"
            :type="row.stockWarning ? 'primary' : 'info'"
          >
            {{ row.stockWarning ? "开启" : "关闭" }}
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
import { PAGE, PAGE_SIZE } from "@/constants/app";
import { ref } from "vue";
import { WalmartProductProps } from "@/api/product/walmart";
import ProductItem from "@/components/ProductItem/index.vue";
import { RenderCopyIcon } from "@/utils";

const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const tableData = ref<WalmartProductProps[]>([
  {
    platform: "亚马逊",
    productImageUrl:
      "https://i5.walmartimages.com/asr/69065a2c-7bde-441f-a287-950cf514087f.10bb29be470fcf9020b4672fa59e2d28.jpeg?odnWidth=300&odnHeight=300",
    productName:
      "Younghome Knife Set, 13 PCS Stainless Steel Kitchen Knife Block Set with Built-in Sharpener",
    productSku: "Zoe-Knifeset-13",
    productId: "13353521000",
    shopName: "星与-沃尔玛-花仙兽",
    shopId: "10001152604",
    price: 199.99,
    status: "已发布",
    stock: 83192,
    stockWarning: true,
  },
]);
const loading = ref(false);
const total = ref(0);
</script>
<style lang="scss" scoped></style>
