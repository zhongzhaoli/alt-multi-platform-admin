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
          <SelectTiktokStore v-model="form[row.prop]" multiple @change="getListFun" />
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
            :size="60"
            :image-url="row.productImageUrl"
            :product-name="row.new_title"
            :token="true"
            :desc-list="[
              {
                text: row.product_id,
                prefix: 'ID'
              },
              {
                text: row.global_product_id,
                prefix: 'Global ID'
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
        <template #table-shipping_fee="{ row }">
          <div>
            <b>$ {{ row.shipping_fee.toFixed(2) }}</b>
          </div>
          <div class="d-flex justify-center align-center">
            <RenderCopyIcon :text="row.warehouses_id" type="primary" title="仓库ID" margin="r" />
            <span class="warehouses_id">{{ row.warehouses_id }}</span>
          </div>
        </template>
        <template #table-asin="{ row }">
          <TextEllipsis :text="row.asin" :line="1" />
          <TextEllipsis :text="row.pasin" :line="1" bold />
          <!-- <TextEllipsis :text="row.seller_sku" :line="1" /> -->
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
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from '@/components/FilterContainer/index.vue';
import TsxElementTable from 'tsx-element-table';
import SelectTiktokStore from '@/components/SelectTiktokStore/index.vue';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import * as config from './config';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { ref, shallowRef } from 'vue';
import {
  getTiktokProductList,
  type TiktokProductProps,
  type TiktokProductFilterProps,
  tiktokImageUrl
} from '@/api/product/tiktok';
import ProductItem from '@/components/ProductItem/index.vue';
import { RenderCopyIcon } from '@/utils';
import moment from 'moment-timezone';

const filterValue = ref<Partial<TiktokProductFilterProps>>({});
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const tableData = shallowRef<TiktokProductProps[]>([]);
const loading = shallowRef(false);
const total = shallowRef(0);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getTiktokProductList({
      page: currentPage.value,
      page_size: pageSize.value,
      ...filterValue.value
    });
    tableData.value = (data?.list || []).map((item) => {
      return {
        ...item,
        productImageUrl: tiktokImageUrl(item.product_image[0]),
        updated_at: moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss'),
        created_at: moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
      };
    });
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
.asinBox {
  font-size: 12px;
}
.warehouses_id {
  color: #999;
}
</style>
