<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
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
          <div class="frequencyText">更新频率：每 3 个小时</div>
        </template>
        <template #table-orderNo="{ row }">
          <div class="d-inline-flex">
            PO：
            <RenderCopyIcon
              type="primary"
              :text="row.purchaseOrderId"
              title="采购订单号"
              margin="r"
            />
            <TextEllipsis
              :line="1"
              placement="right"
              :text="`${row.purchaseOrderId || '-'}`"
            />
          </div>
          <div class="d-inline-flex">
            CO：
            <RenderCopyIcon
              type="primary"
              :text="row.customerOrderId"
              title="客户订单号"
              margin="r"
            />
            <TextEllipsis
              :line="1"
              placement="right"
              :text="`${row.customerOrderId || '-'}`"
            />
          </div>
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
                  prefix: 'SKU：',
                },
              ]"
            />
            <div class="quantityAmount">x{{ row.orderLineQuantity || 0 }}</div>
          </div>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from "@/components/FilterContainer/index.vue";
import TsxElementTable from "tsx-element-table";
import ProductItem from "@/components/ProductItem/index.vue";
import * as config from "./config";
import { ref } from "vue";
import { PAGE, PAGE_SIZE } from "@/constants/app";
import {
  type RefundWalmartProps,
  getWalmartRefundList,
  type WalmartRefunFilterProps,
} from "@/api/refund/walmart";
import { RenderCopyIcon } from "@/utils/index";
import TextEllipsis from "@/components/TextEllipsis/index.vue";

const filterValue = ref<Partial<WalmartRefunFilterProps>>({});
const tableData = ref<RefundWalmartProps[]>([]);
const total = ref(0);
const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const loading = ref(false);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getWalmartRefundList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filterValue.value,
    });
    tableData.value = data?.list || [];
    total.value = data?.total || 0;
    loading.value = false;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
getListFun();
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
