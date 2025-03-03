<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer v-model="filterValue" :columns="config.filterColumns" @submit="getListFun" />
    </div>
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true,
          loading: false
        }"
      >
        <template #table-status="{ row }">
          <el-tag disable-transitions :type="config.orderStatusMap[row.status as orderStataus]">
            {{ row.status }}
          </el-tag>
        </template>
        <template #table-product_info="{ row }">
          <div class="multipleProductBox">
            <template v-for="item in row.children" :key="`${item.id}_${item.order_line_number}`">
              <div class="d-flex align-center">
                <ProductItem
                  class="productItem"
                  :image-url="item.sku_image"
                  :product-name="item.product_name"
                  :size="40"
                  :desc-list="[
                    {
                      text: item.sku_id,
                      prefix: 'SKU'
                    }
                  ]"
                />
                <div class="quantityAmount"> x{{ item.order_line_quantity_amount || 1 }} </div>
              </div>
            </template>
          </div>
        </template>
        <template #table-buyer_full_address="{ row }">
          <TextEllipsis :text="`${row.postal_address_name} (${row.phone})`" />
          <TextEllipsis :text="`${row.postal_code} - ${row.buyer_full_address}`" />
        </template>
        <template #table-action="{ row }">
          <template v-if="row.status === '未处理'">
            <el-button link type="primary" @click="openCreditCard">填写信用卡信息</el-button>
          </template>
          <template v-if="row.status === '处理中'">
            <el-button link type="primary" @click="openOrderInfo">填写订单信息</el-button>
          </template>
        </template>
      </TsxElementTable>
    </div>
    <creditCard v-model="creditCardVisible" />
    <OrderInfo v-model="orderInfoVisible" />
  </div>
</template>
<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import * as config from './config';
import FilterContainer from '@/components/FilterContainer/index.vue';
import TsxElementTable from 'tsx-element-table';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import { OrderProps, orderStataus } from '@/api/order/purchase';
import ProductItem from '@/components/ProductItem/index.vue';
import creditCard from './components/creditCard.vue';
import OrderInfo from './components/OrderInfo.vue';

const filterValue = ref<Partial<config.FilterDto>>({});
const tableData = ref<OrderProps[]>([
  {
    shop_name: 'Shenjinping',
    platform: 'walmart',
    platform_order_id: '109003180657237',
    customer_order_id: '200012830684790',
    total_product_amount: 92.22,
    buyer_full_address: 'Georgetown TN 847 Ware Lane',
    postal_code: '37336',
    postal_address_name: 'Roberta Brianne',
    status: '未处理',
    phone: '4233562601',
    children: [
      {
        order_line_item_id: '576878753046237206',
        product_name:
          'Neti Pot Sinus Rinse Kit: Electric Nasal Irrigation System for Nose Discomfort Relief & Nasal Care, Portable Nose Cleaner with 3 Modes for Sinus Rinse, Includes 30 Nasal Saline Packets',
        sale_price: 44.95,
        sku_id: '1730381804442194105',
        sku_image:
          'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/a9b8e2f8656042238900132c1b2215f6~tplv-dx0w9n1ysr-origin-jpeg.jpeg?from=1568152328'
      }
    ]
  },
  {
    shop_name: 'Shenjinping',
    platform: 'walmart',
    platform_order_id: '109003180657237',
    customer_order_id: '200012830684790',
    total_product_amount: 92.22,
    buyer_full_address: 'Georgetown TN 847 Ware Lane',
    postal_code: '37336',
    postal_address_name: 'Roberta Brianne',
    status: '处理中',
    phone: '4233562601',
    children: [
      {
        order_line_item_id: '576878753046237206',
        product_name:
          'Neti Pot Sinus Rinse Kit: Electric Nasal Irrigation System for Nose Discomfort Relief & Nasal Care, Portable Nose Cleaner with 3 Modes for Sinus Rinse, Includes 30 Nasal Saline Packets',
        sale_price: 44.95,
        sku_id: '1730381804442194105',
        sku_image:
          'https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/a9b8e2f8656042238900132c1b2215f6~tplv-dx0w9n1ysr-origin-jpeg.jpeg?from=1568152328'
      }
    ]
  }
]);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);

// 信用卡信息
const creditCardVisible = shallowRef(false);
const openCreditCard = () => {
  creditCardVisible.value = true;
};

// 订单信息
const orderInfoVisible = shallowRef(false);
const openOrderInfo = () => {
  orderInfoVisible.value = true;
};

const getListFun = () => {
  console.log(filterValue.value);
};
</script>
<style lang="scss" scoped>
.container {
  & > .tableBox {
    & .productItem {
      flex: 1;
    }
    & .multipleProductBox {
      & > div {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      & > div:not(:last-child) {
        margin-bottom: var(--normal-padding);
      }
    }
  }
  & .quantityAmount {
    margin-left: var(--normal-padding);
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 12px;
    background-color: #f6f6f6;
    border-radius: 6px;
  }
}
</style>
