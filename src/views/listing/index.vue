<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
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
          <div class="frequencyText">更新频率：每天 1 点更新</div>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from "@/components/FilterContainer/index.vue";
import TsxElementTable from "tsx-element-table";
import * as config from "./config";
import { ref } from "vue";
import { PAGE, PAGE_SIZE } from "@/constants/app";
import {
  ListingFilterProps,
  type ListingProps,
  getListingList,
} from "@/api/listing";

// 获取列表
const filterValue = ref<Partial<ListingFilterProps>>({});
const tableData = ref<ListingProps[]>([
  {
    id: 1,
    platform: "沃尔玛",
    shopName: "星与-沃尔玛-花仙兽",
    shopId: "101133243",
    totalLinkCount: 39123,
    onSaleLinkCount: 28192,
    todayOnSaleLinkCount: 1203,
    todayOffSaleLinkCount: 4912,
  },
]);
const loading = ref(false);
const total = ref(0);
const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const getListFun = async () => {
  loading.value = true;
  try {
    const { datas } = await getListingList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filterValue.value,
    });
    tableData.value = datas?.data || [];
    total.value = datas?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
getListFun();
</script>
<style lang="scss" scoped></style>
