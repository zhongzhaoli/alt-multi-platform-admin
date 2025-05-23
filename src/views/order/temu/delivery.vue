<template>
  <div class="container">
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
        <template #table-productInfo="{ row }">
          <ProductItem
            class="productItem"
            :image-url="row.originalPicUrl"
            :product-name="row.title"
            :size="40"
            :desc-list="[
              {
                text: row.quantity,
                prefix: '数量'
              }
            ]"
          />
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import * as config from './config';
import { shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import ProductItem from '@/components/ProductItem/index.vue';
import { getTemuDeliveryOrder } from '@/api/order/temu';
import moment from 'moment-timezone';

const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const tableData = shallowRef<any[]>([]);
const loading = shallowRef(false);
const total = shallowRef(0);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getTemuDeliveryOrder({
      page: page.value,
      page_size: pageSize.value
    });
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      gmtLastDelivery: moment(item.gmtLastDelivery).format('YYYY-MM-DD HH:mm:ss'),
      gmtOrderModified: moment(item.gmtOrderModified).format('YYYY-MM-DD HH:mm:ss'),
      gmtOrderStart: moment(item.gmtOrderStart).format('YYYY-MM-DD HH:mm:ss'),
      gmtPay: moment(item.gmtPay).format('YYYY-MM-DD HH:mm:ss')
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
    margin-top: 0;
  }
}
</style>
