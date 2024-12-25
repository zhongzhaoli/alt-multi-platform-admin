<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer :columns="config.filterColumns" />
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
        }"
        :pagination="{
          total,
        }"
      >
        <template #handle-left>
          <div class="frequencyText">更新频率：每天 1 点更新</div>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from '@/components/FilterContainer/index.vue';
import TsxElementTable from 'tsx-element-table';
import * as config from './config';
import { ref } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { ListingProps } from '@/api/listing';

const tableData = ref<ListingProps[]>([
  {
    id: 1,
    platform: '沃尔玛',
    shopName: '星与-沃尔玛-花仙兽',
    shopId: '101133243',
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
</script>
<style lang="scss" scoped></style>
