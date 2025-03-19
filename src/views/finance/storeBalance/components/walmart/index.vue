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
        :table="{ data: tableData, border: true, loading }"
        :pagination="{ total }"
        @table-refresh="getListFun"
        @page-change="getListFun"
      >
        <template #table-action="{ row }">
          <el-button link type="primary" @click="openDetail(row)">查看详情</el-button>
        </template>
        <template #table-closing_balance="{ row }">
          <PriceItem :bold="true" :price="row.closing_balance || 0" />
        </template>
        <template #table-pay_amount="{ row }">
          <PriceItem :bold="false" :price="row.pay_amount || 0" />
        </template>
        <template #table-hold_amount="{ row }">
          <PriceItem :bold="false" :price="row.hold_amount || 0" />
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
            <PriceItem :bold="true" :price="tempRow.closing_balance || 0" />
          </el-form-item>
          <el-form-item label="可用余额：">
            <PriceItem :bold="true" :price="tempRow.pay_amount || 0" />
          </el-form-item>
          <el-form-item label="暂扣金额：">
            <PriceItem :bold="true" :price="tempRow.hold_amount || 0" />
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
import { ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { getWalmartStoreBalance, WalmartStoreBalanceProps } from '@/api/finance/storeBalance';
import PriceItem from '../PriceItem.vue';
import moment from 'moment-timezone';

const filterValue = ref<Partial<config.FilterDto>>({});
const tableData = shallowRef<WalmartStoreBalanceProps[]>([]);
const loading = shallowRef(false);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getWalmartStoreBalance({
      page: page.value,
      page_size: pageSize.value,
      ...filterValue.value
    });
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      last_updated_date: moment(item.last_updated_date).format('YYYY-MM-DD HH:mm:ss'),
      scheduled_settlement_date: moment(item.scheduled_settlement_date).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    }));
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
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
