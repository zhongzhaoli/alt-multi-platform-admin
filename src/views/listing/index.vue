<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      />
      <!-- <template #shop_id="{ form, row }">
          <SelectWalmartStore v-model="form[row.prop]" @change="getListFun" />
        </template>
      </FilterContainer> -->
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
        <template #table-action="{ row }">
          <el-button link type="primary" @click="openFeedList(row)">详情</el-button>
        </template>
        <template #table-shop_survival="{ row }">
          <el-tag v-if="row.shop_survival === 1" disable-transitions type="success"> 存活 </el-tag>
          <el-tag v-else disable-transitions type="danger">死亡</el-tag>
        </template>
      </TsxElementTable>
    </div>
    <el-drawer v-model="feedListDrawer" title="上架详情" size="1000px" @closed="tempListing = null">
      <TsxElementTable
        v-model:current-page="feedListPage"
        v-model:page-size="feedListPageSize"
        :table-columns="config.feedListTableColumns"
        :table="{
          border: true,
          data: feedList,
          loading: feedListLoading
        }"
        :pagination="{
          total: feedListTotal
        }"
        @page-change="getFeedList"
      >
        <template #table-action="{ row }">
          <el-button link type="primary" @click="openDetail(row)">详情</el-button>
        </template>
      </TsxElementTable>
    </el-drawer>
    <FeedDetail
      v-model="detailDialog"
      :feed-id="tempDetail?.feed_id || null"
      @closed="tempDetail = null"
    />
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
import * as config from './config';
import { ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import FeedDetail from './components/feedDetail.vue';
import {
  type ListingProps,
  getWalmartListingList,
  GetListingDto,
  FeedListProps,
  getWlamartFeedList
} from '@/api/listing';
import { cloneDeep } from 'lodash-es';

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

// 获取Feed List
const feedListDrawer = shallowRef(false);
const feedListLoading = shallowRef(false);
const feedListTotal = shallowRef(0);
const feedListPage = shallowRef(PAGE);
const feedListPageSize = shallowRef(PAGE_SIZE);
const feedList = shallowRef<FeedListProps[]>([]);
const tempListing = shallowRef<ListingProps | null>(null);
const openFeedList = (row: ListingProps) => {
  feedListDrawer.value = true;
  tempListing.value = cloneDeep(row);
  getFeedList();
};
const getFeedList = async () => {
  if (!tempListing.value) return;
  try {
    feedListLoading.value = true;
    const { data } = await getWlamartFeedList({
      shop_id: tempListing.value.shop_id,
      created_date: tempListing.value.created_date,
      type: tempListing.value.type,
      page: feedListPage.value,
      page_size: feedListPageSize.value
    });
    feedList.value = data?.list || [];
    feedListTotal.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    feedListLoading.value = false;
  }
};

// 获取feed List 详情
const detailDialog = shallowRef(false);
const tempDetail = shallowRef<FeedListProps | null>(null);
const openDetail = (row: FeedListProps) => {
  detailDialog.value = true;
  tempDetail.value = cloneDeep(row);
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
  &:deep(.jv-code) {
    padding: var(--normal-padding) calc(var(--normal-padding) * 2);
  }
}
</style>
