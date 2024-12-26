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
          <div class="frequencyText">更新频率：每 3 个小时</div>
        </template>
        <template #table-orderNo="{ row }">
          <RenderCopyIcon
            :text="row.orderSn"
            type="primary"
            title="ASIN"
            margin="r"
          />{{ row.orderSn }}
        </template>
        <template #table-productInfo="{ row }">
          <div class="d-flex align-center">
            <ProductItem
              class="productItem"
              :image-url="row.productImageUrl"
              :product-name="row.productName"
              :desc-list="[
                {
                  text: row.productSku,
                  prefix: 'MSKU：',
                },
              ]"
            />
            <div class="quantityAmount">x{{ row.orderLineQuantity || 0 }}</div>
          </div>
        </template>
        <template #table-reason="{ row }">
          <TextEllipsis :text="row.reason" :line="2" />
        </template>
        <template #table-action>
          <el-button link type="primary">取消</el-button>
          <el-button link type="primary">同意</el-button>
          <el-button link type="primary">拒绝</el-button>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from "@/components/FilterContainer/index.vue";
import TsxElementTable from "tsx-element-table";
import ProductItem from "@/components/ProductItem/index.vue";
import TextEllipsis from "@/components/TextEllipsis/index.vue";
import * as config from "./config";
import { ref } from "vue";
import { PAGE, PAGE_SIZE } from "@/constants/app";
import { RefundTiktokProps } from "@/api/refund/tiktok";
import { RenderCopyIcon } from "@/utils/index";

const tableData = ref<RefundTiktokProps[]>([
  {
    id: 1,
    orderSn: "108933798083879",
    shopName: "星与-沃尔玛-花仙兽",
    orderStatus: "已发起",
    productImageUrl:
      "https://i5.walmartimages.com/asr/69065a2c-7bde-441f-a287-950cf514087f.10bb29be470fcf9020b4672fa59e2d28.jpeg?odnWidth=300&odnHeight=300",
    productName:
      "Younghome Knife Set, 13 PCS Stainless Steel Kitchen Knife Block Set with Built-in Sharpener",
    productSku: "Zoe-Knifeset-13",
    name: "cynthia palma",
    reason:
      "I want to return the product. Beautiful product, but not what I expected.",
    orderAmount: 102.33,
    requestDate: "2024/08/01 12:00:00",
  },
]);
const total = ref(0);
const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const loading = ref(false);
</script>
<style lang="scss" scoped>
.container {
  & > .tableBox {
    & .productItem {
      flex: 1;
    }
    & .quantityAmount {
      margin-left: var(--normal-padding);
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 12px;
      background-color: #f6f6f6;
      border-radius: 6px;
    }
  }
}
</style>
