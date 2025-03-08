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
        ref="tableRef"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true,
          rowKey: (row: WalmartProductProps) => row.shop_id + row.sku + row.asin,
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
        @selection-change="selectionChange"
      >
        <template #handle-left>
          <div class="d-flex align-center">
            <el-button
              type="primary"
              :disabled="!selectionList.length"
              @click="retireItemFun(selectionList)"
            >
              批量下架
            </el-button>
            <div class="frequencyText">更新频率：每 6 个小时</div>
          </div>
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
            :product-name="row.new_title || row.title"
            :desc-list="[
              {
                text: row.item_id,
                prefix: 'ID'
              },
              {
                text: row.sku,
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
        <template #table-action="{ row }">
          <el-button link type="primary" @click="retireItemFun([row])">下架</el-button>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from '@/components/FilterContainer/index.vue';
import TsxElementTable, { ComponentInstance } from 'tsx-element-table';
import SelectWalmartStore from '@/components/SelectWalmartStore/index.vue';
import * as config from './config';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { ref, shallowRef } from 'vue';
import {
  getWalmartProductList,
  type WalmartProductFilterProps,
  type WalmartProductProps,
  retireProduct
} from '@/api/product/walmart';
import ProductItem from '@/components/ProductItem/index.vue';
import { RenderCopyIcon } from '@/utils';
import moment from 'moment-timezone';
import { useMessageBox } from '@/hooks/useMessageBox';
import { ElMessage } from 'element-plus';

const filterValue = ref<Partial<WalmartProductFilterProps>>({});
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const tableData = ref<WalmartProductProps[]>([]);
const loading = shallowRef(false);
const total = shallowRef(0);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getWalmartProductList({
      page: currentPage.value,
      page_size: pageSize.value,
      ...filterValue.value
    });
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      productImageUrl: item.image_url && item.image_url.length ? item.image_url[0] : '',
      updated_at: moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      created_at: moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
    }));
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

// 下架
const selectionList = ref<WalmartProductProps[]>([]);
const tableRef = ref<ComponentInstance | null>(null);
const selectionChange = (rows: WalmartProductProps[]) => {
  selectionList.value = rows;
};
const retireItemFun = async (rows: WalmartProductProps[]) => {
  if (!rows.length) return ElMessage.warning('请选择商品');
  if (rows.length > 20) return ElMessage.warning('最多选择20个商品');
  useMessageBox('确认下架该商品？', async () => {
    try {
      await retireProduct({
        products: rows.map((v) => {
          return {
            shop_id: v.shop_id,
            sku: v.sku,
            asin: v.asin
          };
        })
      });
      ElMessage.success('下架成功');
      tableRef.value?.getTableRef().clearSelection();
      getListFun();
    } catch (err) {
      console.log(err);
    }
  });
};
getListFun();
</script>
<style lang="scss" scoped>
.container {
  & .frequencyText {
    margin-left: var(--normal-padding);
  }
}
</style>
