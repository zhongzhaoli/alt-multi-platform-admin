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
          loading,
          summaryMethod: getSummaries,
          showSummary: true,
        }"
        :handle="{
          show: true,
          rightColumns: config.handleRightColumns,
        }"
        :pagination="{
          total,
        }"
        @page-change="getListFun"
        @table-refresh="getListFun"
      >
        <template #handle-left>
          <div class="d-flex align-center">
            <div class="selectBox">
              <el-select
                v-model="platform"
                placeholder="请选择平台"
                @change="getListFun"
              >
                <el-option value="walmart" label="沃尔玛">沃尔玛</el-option>
                <el-option value="tiktok" label="Tiktok">Tiktok</el-option>
              </el-select>
            </div>
            <div class="dateRangeBox">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                :clearable="false"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                :shortcuts="shortcuts"
                @change="getListFun"
              />
            </div>
          </div>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from "tsx-element-table";
import * as config from "./config";
import { ref, VNode } from "vue";
import { PAGE, PAGE_SIZE } from "@/constants/app";
import { shortcuts } from "@/config/dateRange";
import {
  type ListingProps,
  getWalmartListingList,
  getWalmartSummary,
  getTiktokSummary,
  getTiktokListingList,
  GetListingDto,
} from "@/api/listing";
import moment from "moment-timezone";

const WALMART_RATING_NUMBER = 2000;
const TIKTOK_RATING_NUMBER = 100;

// 获取列表
const tableData = ref<ListingProps[]>([]);
const dateRange = ref<[Date, Date]>([new Date(), new Date()]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const platform = ref<"tiktok" | "walmart">("walmart");
const summaryData = ref<ListingProps | null>(null);
const getListFun = async () => {
  const startDate = dateRange.value ? dateRange.value[0] : new Date();
  const endDate = dateRange.value ? dateRange.value[1] : new Date();
  const diff = moment(endDate).diff(moment(startDate), "days") + 1;
  const searchParams: GetListingDto = {
    page: currentPage.value,
    page_size: pageSize.value,
    start_date: `${moment(startDate).format("yyyy-MM-DD 00:00:00")}`,
    end_date: `${moment(endDate).format("yyyy-MM-DD 23:59:59")}`,
  };
  console.log(searchParams);
  if (platform.value === "walmart") {
    getWalmartList(searchParams, diff);
  } else {
    getTiktokList(searchParams, diff);
  }
};

const getWalmartList = async (params: GetListingDto, diff: number) => {
  loading.value = true;
  try {
    const [data1, data2] = await Promise.all([
      getWalmartListingList(params),
      getWalmartSummary(params),
    ]);
    tableData.value = (data1.data?.list || []).map((item) => ({
      ...item,
      listing_rating: item.listing_count / (diff * WALMART_RATING_NUMBER),
    }));
    total.value = data1.data?.total || 0;
    summaryData.value = {
      ...data2.data!.list[0],
      listing_rating:
        data2.data!.list[0].listing_count /
        (diff * WALMART_RATING_NUMBER * total.value),
    };
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getTiktokList = async (params: GetListingDto, diff: number) => {
  loading.value = true;
  try {
    const [data1, data2] = await Promise.all([
      getTiktokListingList(params),
      getTiktokSummary(params),
    ]);
    tableData.value = (data1.data?.list || []).map((item) => ({
      ...item,
      listing_rating: item.listing_count / (diff * TIKTOK_RATING_NUMBER),
    }));
    total.value = data1.data?.total || 0;
    summaryData.value = {
      ...data2.data!.list[0],
      listing_rating:
        data2.data!.list[0].listing_count /
        (diff * TIKTOK_RATING_NUMBER * total.value),
    };
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const getSummaries = () => {
  const sums: (string | VNode)[] = [
    "汇总",
    "-",
    "-",
    (summaryData.value?.all_count || 0).toFixed(0),
    (summaryData.value?.for_sale_count || 0).toFixed(0),
    (summaryData.value?.listing_count || 0).toFixed(0),
    `${((summaryData.value?.listing_rating || 0) * 100).toFixed(2)}%`,
    (summaryData.value?.remove_count || 0).toFixed(0),
  ];
  return sums;
};

getListFun();
</script>
<style lang="scss" scoped>
.container {
  & > .tableBox {
    margin-top: 0;
    & .selectBox {
      width: 140px;
      margin-right: var(--normal-padding);
    }
    & .dateRangeBox {
      width: 240px;
      &:deep(.el-date-editor) {
        font-size: 12px;
        width: 100%;
      }
    }
  }
}
</style>
