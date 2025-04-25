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
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true,
          loading,
          showSummary: true,
          summaryMethod: getSummaries
        }"
        :pagination="{ total }"
        @table-refresh="getListFun"
        @page-change="getListFun"
        @sort-change="sortChange"
      >
        <template #table-available="{ row }">
          <el-tag v-if="row.available" type="success" disable-transitions>存活</el-tag>
          <el-tag v-else type="danger" disable-transitions>死亡</el-tag>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from '@/components/FilterContainer/index.vue';
import SelectTiktokStore from '@/components/SelectTiktokStore/index.vue';
import TsxElementTable from 'tsx-element-table';
import * as config from './config';
import { h, ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import {
  GetTiktokBalanceDto,
  getTiktokStoreBalance,
  TiktokStoreBalanceProps,
  TiktokStoreBalanceSummaryProps
} from '@/api/finance/storeBalance';
import PriceItem from '@/components/PriceItem/index.vue';
import moment from 'moment-timezone';

const filterValue = ref<Partial<config.FilterDto>>({});
const tableData = shallowRef<TiktokStoreBalanceProps[]>([]);
const loading = shallowRef(false);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const summaryData = ref<TiktokStoreBalanceSummaryProps>({
  total_awaiting_payment: 0,
  total_paid: 0,
  total_paying: 0
});
const getListFun = async () => {
  loading.value = true;
  try {
    const searchParams: GetTiktokBalanceDto = {
      page: page.value,
      page_size: pageSize.value,
      ...filterValue.value
    };
    if (sortOrder.value) {
      searchParams.sort = JSON.stringify(sortOrder.value);
    }
    const { data } = await getTiktokStoreBalance(searchParams);
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      created_at: moment(item.created_at).format('YYYY-MM-DD HH:mm:ss'),
      updated_at: moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss')
    }));
    total.value = data?.total || 0;
    summaryData.value = data.all;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

// 排序条件变化
const sortOrder = shallowRef<{ [key: string]: 'DESC' | 'ASC' } | null>(null);
const sortChange = (data: { column: any; prop: string; order: any }) => {
  if (!data.order) {
    sortOrder.value = null;
  } else {
    sortOrder.value = {
      [data.prop]: data.order === 'ascending' ? 'ASC' : 'DESC'
    };
  }
  getListFun();
};

// 汇总
const getSummaries = () => {
  const { total_awaiting_payment, total_paid, total_paying } = summaryData.value;
  return [
    '-',
    '-',
    '汇总',
    h(PriceItem, { price: total_awaiting_payment, cent: false }),
    h(PriceItem, { price: total_paid, cent: false }),
    h(PriceItem, { price: total_paying, cent: false }),
    '-',
    '-',
    '-',
    '-'
  ];
};

getListFun();
</script>
<style lang="scss" scoped>
.container {
  .hr {
    height: 1px;
    background-color: #ebeef5;
    margin: 20px 0;
  }
}
</style>
