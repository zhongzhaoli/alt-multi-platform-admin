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
          <div class="frequencyText">更新频率：每 6 个小时</div>
        </template>
        <template #table-productInfo="{ row }">
          <ProductItem
            class="productItem"
            type="ordinary"
            :item="{
              imageUrl: row.productImageUrl,
              productName: row.productName,
              sku: row.productSku,
              asin: row.productAsin,
            }"
          />
        </template>
        <template #table-deliveryMethod="{ row }">
          <el-tag
            disable-transitions
            effect="plain"
            :type="row.deliveryMethod ? 'primary' : 'info'"
          >
            {{ row.deliveryMethod ? '是' : '否' }}
          </el-tag>
        </template>
        <template #table-deliveryTime="{ row }">
          <el-tag
            disable-transitions
            effect="plain"
            :type="row.deliveryTime ? 'primary' : 'info'"
          >
            {{ row.deliveryTime ? '是' : '否' }}
          </el-tag>
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
import { LocalProductProps } from '@/api/product/local';
import ProductItem from './components/ProductItem.vue';

const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const tableData = ref<LocalProductProps[]>([
  {
    platform: '亚马逊',
    productImageUrl:
      'https://i5.walmartimages.com/asr/69065a2c-7bde-441f-a287-950cf514087f.10bb29be470fcf9020b4672fa59e2d28.jpeg?odnWidth=300&odnHeight=300',
    productName:
      'Younghome Knife Set, 13 PCS Stainless Steel Kitchen Knife Block Set with Built-in Sharpener',
    productSku: 'Zoe-Knifeset-13',
    productAsin: 'B0CT4BB651',
    sellerCountry: 'US',
    brand: 'STANLEY',
    status: '在售',
    price: 35,
    deliveryMethod: true,
    deliveryTime: false,
  },
]);
const loading = ref(false);
const total = ref(0);
</script>
<style lang="scss" scoped></style>
