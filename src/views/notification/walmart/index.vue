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
          <span class="frequencyText">更新频率：实时更新</span>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
import SelectWalmartStore from '@/components/SelectWalmartStore/index.vue';
import * as config from './config';
import { getNotificationList, type NotificationProps } from '@/api/notification/walmart';
import { shallowRef, ref } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import moment from 'moment-timezone';

defineOptions({
  name: 'NotificationWalmart'
});

const filterValue = ref<Partial<config.FilterDto>>({});
const tableData = shallowRef<NotificationProps[]>([]);
const loading = shallowRef(false);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getNotificationList({
      page: page.value,
      page_size: pageSize.value,
      ...filterValue.value
    });
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      updated_at: moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss')
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
    & .testText {
      font-size: 13px;
      color: #999;
      padding-left: 4px;
    }
  }
}
</style>
