<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      >
        <template #shop_id="{ form, row }">
          <SelectWalmartStore v-model="form[row.prop]" multiple @change="getListFun" />
        </template>
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
        @table-refresh="getListFun"
        @page-change="getListFun"
      >
        <template #handle-left>
          <div class="frequencyText">更新频率：实时更新</div>
        </template>
        <template #table-return_order_id="{ row }">
          <div class="d-inline-flex">
            <RenderCopyIcon
              type="primary"
              :text="row.return_order_id"
              title="退货订单号"
              margin="r"
            />
            <TextEllipsis :line="1" placement="right" :text="`${row.return_order_id || '-'}`" />
          </div>
        </template>
        <template #table-orderNo="{ row }">
          <div class="d-inline-flex">
            PO：
            <RenderCopyIcon
              type="primary"
              :text="row.purchase_order_id"
              title="采购订单号"
              margin="r"
            />
            <TextEllipsis :line="1" placement="right" :text="`${row.purchase_order_id || '-'}`" />
          </div>
          <div class="d-inline-flex">
            CO：
            <RenderCopyIcon
              type="primary"
              :text="row.customer_order_id"
              title="客户订单号"
              margin="r"
            />
            <TextEllipsis :line="1" placement="right" :text="`${row.customer_order_id || '-'}`" />
          </div>
        </template>
        <template #table-productInfo="{ row }">
          <div class="d-flex align-center">
            <ProductItem
              class="productItem"
              :image-url="row.product_image_url"
              :product-name="row.product_name"
              :desc-list="[
                {
                  text: row.sku,
                  prefix: 'SKU'
                }
              ]"
            />
            <div class="quantityAmount"> x{{ row.refunded_qty || 0 }} </div>
          </div>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from '@/components/FilterContainer/index.vue';
import SelectWalmartStore from '@/components/SelectWalmartStore/index.vue';
import TsxElementTable from 'tsx-element-table';
import ProductItem from '@/components/ProductItem/index.vue';
import * as config from './config';
import { ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import {
  type RefundWalmartProps,
  getWalmartRefundList,
  type WalmartRefunFilterProps
} from '@/api/refund/walmart';
import { RenderCopyIcon } from '@/utils/index';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import moment from 'moment-timezone';

const filterValue = ref<Partial<WalmartRefunFilterProps>>({});
const tableData = shallowRef<RefundWalmartProps[]>([]);
const total = shallowRef(0);
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const loading = shallowRef(false);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getWalmartRefundList({
      page: currentPage.value,
      page_size: pageSize.value,
      ...filterValue.value
    });
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      return_order_date: moment(item.return_order_date).format('YYYY-MM-DD HH:mm:ss')
    }));
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
