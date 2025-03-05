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
          loading
        }"
        :pagination="{ total }"
        @page-change="getListFun"
        @table-refresh="getListFun"
      >
        <template #table-status="{ row }">
          <el-tag disable-transitions :type="config.orderStatusMap[row.status as OrderStatusEnum]">
            {{ row.status }}
          </el-tag>
        </template>
        <template #table-product_info="{ row }">
          <div class="multipleProductBox">
            <template
              v-for="item in row.children"
              :key="`${row.shop_id}_${row.platform_order_id}_${item.sku}`"
            >
              <div class="d-flex align-center">
                <ProductItem
                  class="productItem"
                  :image-url="item.image_url"
                  :product-name="item.product_name"
                  :size="40"
                  :desc-list="[
                    {
                      text: item.sku,
                      prefix: 'SKU'
                    }
                  ]"
                />
                <div class="quantityAmount"> x{{ item.number || 1 }} </div>
              </div>
            </template>
          </div>
        </template>
        <template #table-buyer_full_address="{ row }">
          <TextEllipsis :text="`${row.name} (${row.phone_number})`" />
          <TextEllipsis :text="`${row.postal_code} - ${row.full_address}`" />
        </template>
        <template #table-action="{ row }">
          <template v-if="row.status === '未处理'">
            <el-button link type="primary" @click="applyCreditCard(row)">申请信用卡</el-button>
            <el-button link type="primary" @click="openInconsistent(row)">不符合条件</el-button>
          </template>
          <template v-if="row.status === '处理中'">
            <el-button link type="primary" @click="openOrderInfo">填写订单信息</el-button>
          </template>
        </template>
      </TsxElementTable>
    </div>
    <OrderInfo v-model="orderInfoVisible" />
    <ConfirmDialog v-model="inconsistentVisible" title="订单不符合条件" width="400px">
      <el-form label-position="top">
        <el-form-item label="">
          <el-select v-model="inconReason">
            <el-option label="价格不符" :value="OrderInconsistentResonEnum.价格不符" />
            <el-option label="配送时效不符" :value="OrderInconsistentResonEnum.配送时效不符" />
            <el-option label="库存不符" :value="OrderInconsistentResonEnum.库存不符" />
            <el-option label="Rating不符" :value="OrderInconsistentResonEnum.Rating不符" />
          </el-select>
        </el-form-item>
      </el-form>
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import * as config from './config';
import FilterContainer from '@/components/FilterContainer/index.vue';
import TsxElementTable from 'tsx-element-table';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import {
  OrderProps,
  OrderStatusEnum,
  OrderInconsistentResonEnum,
  getOrderList,
  orderHander
} from '@/api/order/purchase';
import ProductItem from '@/components/ProductItem/index.vue';
import OrderInfo from './components/OrderInfo.vue';
import { useMessageBox } from '@/hooks/useMessageBox';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { ElMessage } from 'element-plus';

const filterValue = ref<Partial<config.FilterDto>>({});
const tableData = ref<OrderProps[]>([]);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const loading = shallowRef(false);

// 申请信用卡
const tempOrder = ref<OrderProps | null>(null);
const applyCreditCard = (row: OrderProps) => {
  tempOrder.value = row;
  useMessageBox('确认申请信用卡？', async () => {
    const formData = {
      shop_id: row.shop_id,
      platform: row.platform,
      platform_order_id: row.platform_order_id,
      customer_order_id: row.customer_order_id,
      status: OrderStatusEnum.开卡中
    };
    try {
      await orderHander(formData);
      ElMessage.success('申请信用卡成功');
      getListFun();
    } catch (err) {
      console.log(err);
      ElMessage.error('申请信用卡失败');
    }
  });
};

// 不符合条件
const inconsistentVisible = shallowRef(false);
const inconReason = shallowRef<OrderInconsistentResonEnum>(OrderInconsistentResonEnum.价格不符);
const openInconsistent = (row: OrderProps) => {
  tempOrder.value = row;
  inconsistentVisible.value = true;
};

// 订单信息
const orderInfoVisible = shallowRef(false);
const openOrderInfo = () => {
  orderInfoVisible.value = true;
};

const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getOrderList({
      page: page.value,
      page_size: pageSize.value,
      ...filterValue.value
    });
    tableData.value = data?.list || [];
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
