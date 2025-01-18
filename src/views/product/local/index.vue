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
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true,
          loading,
          rowKey: 'id',
          defaultExpandAll: true,
          treeProps: {
            children: 'children'
          },
          spanMethod: arraySpanMethod
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
          <div class="frequencyText">更新频率：每 6 个小时</div>
        </template>
        <template #table-platform="{ row }">
          <template v-if="'children' in row && row.children && row.children.length">
            <div class="parentForm">
              <div class="childFormItem">
                <div class="label">父ASIN：</div>
                <div class="value">{{ row.pasin || '-' }}</div>
              </div>
              <div class="childFormItem">
                <div class="label">店铺：</div>
                <div class="value">{{ row.shop_name || '-' }}</div>
              </div>
              <div class="childFormItem">
                <div class="label">品牌：</div>
                <div class="value">{{ row.brand || '-' }}</div>
              </div>
            </div>
          </template>
        </template>
        <template #table-productInfo="{ row }">
          <ProductItem
            :size="60"
            :image-url="row.productImageUrl"
            :product-name="row.productName"
            :desc-list="[
              {
                text: row.productSku,
                prefix: 'SKU'
              },
              {
                text: row.productAsin,
                prefix: 'ASIN'
              }
            ]"
          />
        </template>
        <template #table-deliveryMethod="{ row }">
          <el-tag
            disable-transitions
            effect="plain"
            :type="row.deliveryMethod ? 'primary' : 'info'"
          >
            {{ row.deliveryMethod ? '是' : '否' }}
          </el-tag>
        </template>
        <template #table-deliveryTime="{ row }">
          <el-tag disable-transitions effect="plain" :type="row.deliveryTime ? 'primary' : 'info'">
            {{ row.deliveryTime ? '是' : '否' }}
          </el-tag>
        </template>
        <template #table-shops="{ row }">
          <el-button link type="primary" @click="openShops(row)"> 查看详情 </el-button>
        </template>
      </TsxElementTable>
    </div>
    <el-drawer v-model="shopsVisible" size="40%" title="上架店铺">
      <TsxElementTable
        v-model:current-page="shopsPage"
        v-model:page-size="shopsPageSize"
        :table-columns="config.shopsTableColumns"
        :table="{
          data: shopsTableData,
          loading: shopsLoading,
          border: true,
          size: 'small'
        }"
        :handle="{ show: false }"
        :pagination="{
          total: shopsTotal
        }"
      />
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from '@/components/FilterContainer/index.vue';
import TsxElementTable from 'tsx-element-table';
import * as config from './config';
import { ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import {
  getLocalProductList,
  type LocalProductProps,
  type LocalProductFilterProps
} from '@/api/product/local';
import ProductItem from '@/components/ProductItem/index.vue';
import { TableColumnCtx } from 'element-plus';

// 获取列表
const filterValue = ref<Partial<LocalProductFilterProps>>({});
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const tableData = shallowRef<LocalProductProps[]>([]);
const loading = shallowRef(false);
const total = shallowRef(0);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getLocalProductList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filterValue.value
    });
    tableData.value = data?.list || [];
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
getListFun();

// 上架店铺
const shopsVisible = shallowRef(false);
const shopsTableData = shallowRef([]);
const shopsLoading = shallowRef(false);
const shopsPage = shallowRef(PAGE);
const shopsPageSize = shallowRef(PAGE_SIZE);
const shopsTotal = shallowRef(0);
const openShops = (row: LocalProductProps) => {
  console.log(row);
  shopsVisible.value = true;
};

// 合并表格
interface SpanMethodProps {
  row: LocalProductProps;
  column: TableColumnCtx<LocalProductProps>;
  rowIndex: number;
  columnIndex: number;
}
const arraySpanMethod = ({ row, columnIndex }: SpanMethodProps) => {
  if ('children' in row && row.children && row.children.length > 0) {
    if (columnIndex === 0) {
      return [1, 10];
    } else {
      return [0, 0];
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  & > .tableBox {
    & .parentForm {
      display: inline-flex;
      align-items: center;
      & > .childFormItem {
        display: flex;
        align-items: center;
        &:not(:last-child) {
          margin-right: 30px;
        }
        & > .label {
          font-size: 14px;
          color: #8f8f9a;
        }
        & > .value {
          font-size: 14px;
          color: #000;
        }
      }
    }
    &:deep(tbody) {
      & .el-table__indent {
        display: none;
      }
      & .el-table__placeholder {
        display: none;
      }
      & > .el-table__row--level-0 > td {
        text-align: left;
        background-color: #f5f7fa;
      }
    }
  }
}
</style>
