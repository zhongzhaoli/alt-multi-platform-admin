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
        <template #table-action="{ row }">
          <el-button link type="primary" @click="openDetail(row)">查看详情</el-button>
        </template>
        <template #table-closing_balance="{ row }">
          <PriceItem :cent="false" :bold="true" :price="row.closing_balance || 0" />
        </template>
        <template #table-pay_amount="{ row }">
          <PriceItem :cent="false" :bold="false" :price="row.pay_amount || 0" />
        </template>
        <template #table-hold_amount="{ row }">
          <PriceItem :cent="false" :bold="false" :price="row.hold_amount || 0" />
        </template>
      </TsxElementTable>
    </div>
    <el-drawer v-model="detailVisible" size="500px" title="店铺余额详情">
      <template v-if="tempRow">
        <el-form label-position="left" label-width="120px">
          <el-form-item label="店铺ID：">
            <div>{{ tempRow.shop_id }}</div>
          </el-form-item>
          <el-form-item label="店铺名称：">
            <div>{{ tempRow.shop_name }}</div>
          </el-form-item>
          <el-form-item label="收款平台：">
            <div>{{ tempRow.payment_processor || '-' }}</div>
          </el-form-item>
          <div class="hr" />
          <el-form-item label="店铺余额：">
            <PriceItem
              :abs="false"
              :cent="false"
              :bold="true"
              :price="tempRow.closing_balance || 0"
            />
          </el-form-item>
          <el-form-item label="回款金额：">
            <PriceItem :abs="false" :cent="false" :bold="true" :price="tempRow.pay_amount || 0" />
          </el-form-item>
          <el-form-item label="暂扣金额：">
            <PriceItem :abs="false" :cent="false" :bold="true" :price="tempRow.hold_amount || 0" />
          </el-form-item>
          <el-form-item label="暂扣时间：">
            <div>{{ tempRow.hold_dates || '-' }}</div>
          </el-form-item>
          <div class="hr" />
          <el-form-item label="结账周期：">
            <div>{{ tempRow.settle_cycle || '-' }}</div>
          </el-form-item>
          <el-form-item label="预定结算时间：">
            <div>{{ tempRow.scheduled_settlement_date || '-' }}</div>
          </el-form-item>
          <el-form-item label="最后更新时间：">
            <div>{{ tempRow?.last_updated_date || '-' }}</div>
          </el-form-item>
        </el-form>
      </template>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from '@/components/FilterContainer/index.vue';
import SelectWalmartStore from '@/components/SelectWalmartStore/index.vue';
import TsxElementTable from 'tsx-element-table';
import * as config from './config';
import { h, ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import {
  GetWalmartBalanceDto,
  getWalmartStoreBalance,
  WalmartStoreBalanceProps,
  WalmartStoreBalanceSummaryProps
} from '@/api/finance/storeBalance';
import PriceItem from '@/components/PriceItem/index.vue';
import moment from 'moment-timezone';

const filterValue = ref<Partial<config.FilterDto>>({});
const tableData = shallowRef<WalmartStoreBalanceProps[]>([]);
const loading = shallowRef(false);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const summaryData = ref<WalmartStoreBalanceSummaryProps>({
  total_closing_balance: 0,
  total_hold_amount: 0,
  total_pay_amount: 0
});
const getListFun = async () => {
  loading.value = true;
  try {
    const searchParams: GetWalmartBalanceDto = {
      page: page.value,
      page_size: pageSize.value,
      ...filterValue.value
    };
    if (sortOrder.value) {
      searchParams.sort = JSON.stringify(sortOrder.value);
    }
    const { data } = await getWalmartStoreBalance(searchParams);
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      last_updated_date: moment(item.last_updated_date).format('YYYY-MM-DD HH:mm:ss'),
      scheduled_settlement_date: moment(item.scheduled_settlement_date).format(
        'YYYY-MM-DD HH:mm:ss'
      )
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
  const { total_closing_balance, total_pay_amount, total_hold_amount } = summaryData.value;
  return [
    '-',
    '-',
    '汇总',
    h(PriceItem, { price: total_closing_balance, cent: false }),
    h(PriceItem, { price: total_pay_amount, cent: false }),
    h(PriceItem, { price: total_hold_amount, cent: false }),
    '-',
    '-',
    '-',
    '-'
  ];
};

const detailVisible = shallowRef(false);
const tempRow = ref<WalmartStoreBalanceProps | null>(null);
const openDetail = (row: WalmartStoreBalanceProps) => {
  tempRow.value = row;
  detailVisible.value = true;
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
