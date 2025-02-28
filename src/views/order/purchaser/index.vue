<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getUserList"
        @reset="getUserList"
      />
    </div>
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true
        }"
        :handle="{
          show: true
        }"
        :pagination="{
          total
        }"
        :loading="loading"
        @table-refresh="getUserList"
        @page-change="getUserList"
      >
        <template #handle-left>
          <el-button type="primary">一键自动分发</el-button>
        </template>
        <template #table-action>
          <el-button link type="primary">手动分发</el-button>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getPurchaserUserList } from '@/api/order/purchaser';
import type { PurchaserUserProps } from '@/api/order/purchaser';
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
import * as config from './config';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { ref, shallowRef, unref } from 'vue';

const loading = shallowRef(false);
const tableData = shallowRef<PurchaserUserProps[]>([]);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const filterValue = ref<Partial<config.FilterDto>>({});
const getUserList = async () => {
  loading.value = true;
  try {
    const { data } = await getPurchaserUserList({
      page: unref(page),
      page_size: unref(pageSize),
      ...unref(filterValue)
    });
    tableData.value = data?.list || [];
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

getUserList();
</script>
<style lang="scss" scoped></style>
