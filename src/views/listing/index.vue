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
          loading
        }"
        :handle="{
          show: true
          // rightColumns: config.handleRightColumns
        }"
        :pagination="{
          total
        }"
        @page-change="getListFun"
        @table-refresh="getListFun"
      >
        <template #handle-left>
          <el-radio-group v-model="filterType" @change="getListFun">
            <template v-for="item in config.filterTypeOptions" :key="item.value">
              <el-radio-button :label="item.label" :value="item.value" />
            </template>
          </el-radio-group>
        </template>
        <template #table-shop_survival="{ row }">
          <el-tag v-if="row.shop_survival === 1" disable-transitions type="success"> 存活 </el-tag>
          <el-tag v-else disable-transitions type="danger">死亡</el-tag>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
import * as config from './config';
import { ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { type ListingProps, getWalmartListingList, GetListingDto } from '@/api/listing';

// 获取列表
const tableData = shallowRef<ListingProps[]>([]);
const filterValue = ref<Partial<config.FilterDto>>({});
const filterType = ref<'Products' | 'Prices' | 'Inventory'>('Products');
const loading = shallowRef(false);
const total = shallowRef(0);
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const getListFun = async () => {
  const searchParams: GetListingDto = {
    page: currentPage.value,
    page_size: pageSize.value,
    type: filterType.value,
    ...filterValue.value
  };
  getWalmartList(searchParams);
};

const getWalmartList = async (params: GetListingDto) => {
  loading.value = true;
  try {
    const { data } = await getWalmartListingList(params);
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      listing_rating:
        item.items_succeeded && item.items_received ? item.items_succeeded / item.items_received : 0
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
  & > .tableBox {
    & .selectBox {
      width: 140px;
      margin-right: 16px;
      font-size: 13px;
      * {
        font-size: 13px;
      }
    }
    & .dateRangeBox {
      width: 240px;
      &:deep(.el-date-editor) {
        font-size: 12px;
        width: 100%;
      }
      * {
        font-size: 13px;
      }
    }
  }
}
</style>
