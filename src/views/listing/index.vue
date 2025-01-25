<template>
  <div class="container">
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
          <div class="d-flex align-center">
            <div class="selectBox">
              <el-select v-model="platform" placeholder="请选择平台" @change="getListFun">
                <el-option value="walmart" label="沃尔玛">沃尔玛</el-option>
              </el-select>
            </div>
            <div class="dateRangeBox">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :shortcuts="shortcuts"
                @change="getListFun"
              />
            </div>
          </div>
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
import * as config from './config';
import { ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { shortcuts } from '@/config/dateRange';
import { type ListingProps, getWalmartListingList, GetListingDto } from '@/api/listing';

// 获取列表
const tableData = shallowRef<ListingProps[]>([]);
const dateRange = ref<[Date, Date]>();
const loading = shallowRef(false);
const total = shallowRef(0);
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const platform = shallowRef<'tiktok' | 'walmart'>('walmart');
const getListFun = async () => {
  // const startDate = dateRange.value ? dateRange.value[0] : new Date();
  // const endDate = dateRange.value ? dateRange.value[1] : new Date();
  const searchParams: GetListingDto = {
    page: currentPage.value,
    page_size: pageSize.value
  };
  if (platform.value === 'walmart') {
    getWalmartList(searchParams);
  }
};

const getWalmartList = async (params: GetListingDto) => {
  loading.value = true;
  try {
    const { data } = await getWalmartListingList(params);
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      listing_rating: item.items_succeeded / item.items_received
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
    margin-top: 0;
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
