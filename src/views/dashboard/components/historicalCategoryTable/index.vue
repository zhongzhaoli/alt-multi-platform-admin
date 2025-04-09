<template>
  <div class="historicalCategoryComponent">
    <TsxElementTable
      :table-columns="tableColumns"
      :table="{
        border: true,
        data: tableData,
        loading
      }"
      :handle="{
        show: true
      }"
      :pagination="{
        show: false
      }"
      @table-refresh="getListFun"
    >
      <template #handle-left>
        <div class="d-flex align-center">
          <el-date-picker
            v-model="filterDate"
            placeholder="请选择日期"
            type="date"
            value-format="YYYY-MM-DD"
            clearable
            @change="datechange"
          />
          <div class="frequencyText">更新时间：上架前10分钟</div>
        </div>
      </template>
    </TsxElementTable>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import { tableColumns } from './config';
import { shallowRef } from 'vue';
import {
  getWalmartHistoricalCategoryList,
  getTiktokHistoricalCategoryList,
  HistoricalCategoryTableProps
} from '@/api/dashboard/index';
import moment from 'moment-timezone';

const props = defineProps<{
  platform: 'walmart' | 'tiktok';
}>();

const tableData = shallowRef<HistoricalCategoryTableProps[]>([]);
const filterDate = shallowRef(moment().format('YYYY-MM-DD'));
const loading = shallowRef(false);

const getListFun = async () => {
  loading.value = true;
  try {
    if (props.platform === 'tiktok') {
      const { data } = await getTiktokHistoricalCategoryList({ date: filterDate.value });
      tableData.value = data || [];
    } else {
      const { data } = await getWalmartHistoricalCategoryList({ date: filterDate.value });
      tableData.value = data || [];
    }
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

getListFun();

const datechange = () => {
  getListFun();
};
</script>
<style lang="scss" scoped>
.historicalCategoryComponent {
  height: 100%;
  .frequencyText {
    margin-left: var(--normal-padding);
  }
}
</style>
