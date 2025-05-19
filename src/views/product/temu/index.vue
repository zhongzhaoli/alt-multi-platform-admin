<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      >
        <template #shop_id="{ form, row, change }">
          <SelectTemuStore v-model="form[row.prop]" multiple @change="change" />
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
            :size="40"
            :image-url="row.img_path_list.length ? row.img_path_list[0] : null"
            :product-name="row.product_name"
            :desc-list="[
              {
                text: row.skuId,
                prefix: 'SKU ID'
              }
            ]"
          />
        </template>
        <template #table-sku="{ row }">
          <div class="d-flex justify-center align-center">
            <RenderCopyIcon :text="row.sku_id" type="primary" title="SKU" margin="r" />
            <span class="warehouses_id">{{ row.sku_id }}</span>
          </div>
          <div class="d-flex justify-center align-center">
            <RenderCopyIcon :text="row.global_sku_id" type="primary" title="全球 SKU" margin="r" />
            <span class="warehouses_id">{{ row.global_sku_id }}</span>
          </div>
        </template>
        <template #table-seller_sku="{ row }">
          <div class="d-inline-flex justify-center align-center">
            <RenderCopyIcon :text="row.seller_sku" type="primary" title="卖家 SKU" margin="r" />
            <span class="warehouses_id">
              <TextEllipsis :text="row.seller_sku" :line="1" />
            </span>
          </div>
        </template>
        <template #table-asin="{ row }">
          <TextEllipsis :text="row.asin" :line="1" />
          <TextEllipsis :text="row.pasin" :line="1" bold />
        </template>
        <template #table-supplier="{ row }">
          <TextEllipsis :text="row.asin_to_sku" :line="1" />
          <TextEllipsis :text="row.pasin_to_sku" :line="1" bold />
        </template>
        <template #table-skc="{ row }">
          <TextEllipsis :text="row.skc_name" :line="1" />
          <TextEllipsis :text="row.spu_name" :line="1" bold />
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from '@/components/FilterContainer/index.vue';
import TsxElementTable from 'tsx-element-table';
import SelectTemuStore from '@/components/SelectTemuStore/index.vue';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import * as config from './config';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { ref, shallowRef } from 'vue';
import {
  getTemuProductList,
  type TemuProductProps,
  type TemuProductFilterProps
} from '@/api/product/temu';
import ProductItem from '@/components/ProductItem/index.vue';
import { RenderCopyIcon } from '@/utils';
import moment from 'moment-timezone';

defineOptions({
  name: 'ProductShein'
});

const filterValue = ref<Partial<TemuProductFilterProps>>({});
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const tableData = shallowRef<TemuProductProps[]>([]);
const loading = shallowRef(false);
const total = shallowRef(0);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getTemuProductList({
      page: currentPage.value,
      page_size: pageSize.value,
      ...filterValue.value
    });
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      amazon_uptime: item.amazon_uptime
        ? moment(item.amazon_uptime).format('YYYY-MM-DD HH:mm:ss')
        : '-',
      push_date: item.push_date ? moment(item.push_date).format('YYYY-MM-DD HH:mm:ss') : '-',
      confirm_date: item.confirm_date
        ? moment(item.confirm_date).format('YYYY-MM-DD HH:mm:ss')
        : '-'
    }));
    total.value = data?.total || 0;
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
  & .asinBox {
    font-size: 12px;
  }
  & .warehouses_id {
    color: #999;
  }
  & .stockInputNumber {
    width: 100%;
    &:deep(input) {
      text-align: left;
    }
  }
}
</style>
