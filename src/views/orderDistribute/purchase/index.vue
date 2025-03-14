<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      />
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
          <template v-if="row.status === OrderStatusEnum.未处理">
            <el-button
              v-permission="{ type: 'some', value: 'order:purchase:applyCard' }"
              link
              type="primary"
              @click="applyCreditCard(row)"
            >
              申请信用卡
            </el-button>
            <el-button
              v-permission="{ type: 'some', value: 'order:purchase:inconsistent' }"
              link
              type="primary"
              @click="openInconsistent(row)"
            >
              不符合条件
            </el-button>
            <span
              v-permission="{
                type: 'noSome',
                value: ['order:purchase:applyCard', 'order:purchase:inconsistent']
              }"
            >
              -
            </span>
          </template>
          <template v-else-if="row.status === OrderStatusEnum.待绑定">
            <el-button
              v-permission="{ type: 'some', value: 'order:purchase:bindingAccount' }"
              link
              type="primary"
              @click="BindAccountFun(row)"
            >
              绑定账号
            </el-button>
            <span
              v-permission="{
                type: 'noSome',
                value: 'order:purchase:bindingAccount'
              }"
            >
              -
            </span>
          </template>
          <template v-else-if="row.status === OrderStatusEnum.处理中">
            <el-button
              v-permission="{ type: 'some', value: 'order:purchase:orderInfoUp' }"
              link
              type="primary"
              @click="openOrderInfo(row)"
            >
              填写订单信息
            </el-button>
            <span v-permission="{ type: 'noSome', value: 'order:purchase:orderInfoUp' }">-</span>
          </template>
          <template v-else-if="row.status === OrderStatusEnum.开卡中">
            <el-button
              v-permission="{ type: 'some', value: 'order:purchase:cardUp' }"
              link
              type="primary"
              @click="handerCard(row)"
            >
              开卡
            </el-button>
            <span v-permission="{ type: 'noSome', value: 'order:purchase:cardUp' }">-</span>
          </template>
          <template v-else-if="row.status === OrderStatusEnum.老号下单员下单失败">
            <el-button
              v-permission="{ type: 'some', value: 'order:purchase:adminPurchase' }"
              link
              type="primary"
              @click="adminPurchase(row)"
            >
              管理员下单
            </el-button>
            <span v-permission="{ type: 'noSome', value: 'order:purchase:adminPurchase' }">-</span>
          </template>
          <template v-else>-</template>
        </template>
      </TsxElementTable>
    </div>
    <OrderInfo
      v-model="orderInfoVisible"
      :card-number="tempOrder?.card_number"
      :creator-type="tempOrder?.creator_type"
      @submit="orderInfoSubmit"
    />
    <CreditCard v-model="cardVisible" @submit="handerCardSubmit" />
    <BindAccount v-model="bindAccountVisible" @submit="bindAccountSubmit" />
    <CreditCardInfo
      v-model="cardInfoVisible"
      :card-number="tempOrder?.card_number"
      @submit="cardInfoSubmit"
    />
    <ConfirmDialog
      v-model="inconsistentVisible"
      title="订单不符合条件"
      width="400px"
      @submit="inconsistentFun"
    >
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
    <AdminPurchase v-model="adminPurchaseVisible" @submit="adminPurchaseSubmit" />
  </div>
</template>
<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import * as config from './config';
import FilterContainer from '@/components/FilterContainer/index.vue';
import TsxElementTable from 'tsx-element-table';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import BindAccount from './components/BindAccount.vue';
import {
  OrderProps,
  OrderStatusEnum,
  OrderInconsistentResonEnum,
  getOrderList,
  orderHander,
  HandleCardProps,
  OrderInfoSuccessProps,
  OrderInfoFailProps,
  BindAccountProps,
  AdminPurchaseSuccessProps,
  AdminPurchaseFailProps
} from '@/api/orderDistribute/purchase';
import ProductItem from '@/components/ProductItem/index.vue';
import OrderInfo from './components/OrderInfo.vue';
import { useMessageBox } from '@/hooks/useMessageBox';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { ElMessage } from 'element-plus';
import CreditCard from './components/CreditCard.vue';
import CreditCardInfo from './components/CreditCardInfo.vue';
import AdminPurchase from './components/AdminPurchase.vue';

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
    try {
      await orderHander({
        shop_id: row.shop_id,
        platform: row.platform,
        platform_order_id: row.platform_order_id,
        customer_order_id: row.customer_order_id,
        status: OrderStatusEnum.开卡中
      });
      ElMessage.success('申请信用卡成功');
      getListFun();
    } catch (err) {
      console.log(err);
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
const inconsistentFun = () => {
  useMessageBox('确认订单不符合条件？', async () => {
    if (tempOrder.value === null) return;
    try {
      await orderHander({
        shop_id: tempOrder.value.shop_id,
        platform: tempOrder.value.platform,
        platform_order_id: tempOrder.value.platform_order_id,
        customer_order_id: tempOrder.value.customer_order_id,
        status: OrderStatusEnum.不符合条件,
        fail_remark: inconReason.value
      });
      ElMessage.success('订单不符合条件成功');
      inconsistentVisible.value = false;
      getListFun();
    } catch (err) {
      console.log(err);
    }
  });
};

// 办卡
const cardVisible = shallowRef(false);
const handerCard = (row: OrderProps) => {
  tempOrder.value = row;
  if (row.creator_type === 'new') {
    cardVisible.value = true;
  } else {
    cardInfoVisible.value = true;
  }
};
const handerCardSubmit = (formValue: HandleCardProps) => {
  useMessageBox('确认开卡？', async () => {
    if (tempOrder.value === null) return;
    try {
      await orderHander({
        shop_id: tempOrder.value.shop_id,
        platform: tempOrder.value.platform,
        platform_order_id: tempOrder.value.platform_order_id,
        customer_order_id: tempOrder.value.customer_order_id,
        status: OrderStatusEnum.待绑定,
        ...formValue
      });
      ElMessage.success('开卡成功');
      cardVisible.value = false;
      getListFun();
    } catch (err) {
      console.log(err);
    }
  });
};

// 绑定账号
const bindAccountVisible = shallowRef(false);
const BindAccountFun = (row: OrderProps) => {
  tempOrder.value = row;
  bindAccountVisible.value = true;
};
const bindAccountSubmit = (formValue: BindAccountProps) => {
  useMessageBox('确认绑定账号？', async () => {
    if (tempOrder.value === null) return;
    try {
      await orderHander({
        shop_id: tempOrder.value.shop_id,
        platform: tempOrder.value.platform,
        platform_order_id: tempOrder.value.platform_order_id,
        customer_order_id: tempOrder.value.customer_order_id,
        status: OrderStatusEnum.处理中,
        card_number: tempOrder.value.card_number,
        ...formValue
      });
      ElMessage.success('绑定账号成功');
      bindAccountVisible.value = false;
      getListFun();
    } catch (err) {
      console.log(err);
    }
  });
};

// 办卡信用卡信息展示和确认
const cardInfoVisible = shallowRef(false);
const cardInfoSubmit = async () => {
  useMessageBox('确认信用卡信息无误？', async () => {
    if (tempOrder.value === null) return;
    try {
      await orderHander({
        shop_id: tempOrder.value.shop_id,
        platform: tempOrder.value.platform,
        platform_order_id: tempOrder.value.platform_order_id,
        customer_order_id: tempOrder.value.customer_order_id,
        status: OrderStatusEnum.处理中
      });
      ElMessage.success('确认信用卡信息成功');
      cardInfoVisible.value = false;
      getListFun();
    } catch (err) {
      console.log(err);
    }
  });
};

// 订单信息
const orderInfoVisible = shallowRef(false);
const openOrderInfo = (row: OrderProps) => {
  tempOrder.value = row;
  orderInfoVisible.value = true;
};
const orderInfoSubmit = (formValue: OrderInfoSuccessProps | OrderInfoFailProps) => {
  useMessageBox('确认提交订单信息？', async () => {
    if (tempOrder.value === null) return;
    try {
      await orderHander({
        shop_id: tempOrder.value.shop_id,
        platform: tempOrder.value.platform,
        platform_order_id: tempOrder.value.platform_order_id,
        customer_order_id: tempOrder.value.customer_order_id,
        card_number: tempOrder.value.card_number,
        ...formValue
      });
      ElMessage.success('提交订单信息成功');
      orderInfoVisible.value = false;
      getListFun();
    } catch (err) {
      console.log(err);
    }
  });
};

// 管理员下单
const adminPurchaseVisible = shallowRef(false);
const adminPurchase = (row: OrderProps) => {
  tempOrder.value = row;
  adminPurchaseVisible.value = true;
};
const adminPurchaseSubmit = (formValue: AdminPurchaseSuccessProps | AdminPurchaseFailProps) => {
  useMessageBox('确认提交？', async () => {
    if (tempOrder.value === null) return;
    try {
      await orderHander({
        shop_id: tempOrder.value.shop_id,
        platform: tempOrder.value.platform,
        platform_order_id: tempOrder.value.platform_order_id,
        customer_order_id: tempOrder.value.customer_order_id,
        ...formValue
      });
      if (formValue.status === OrderStatusEnum.管理员下单成功) ElMessage.success('管理员下单成功');
      if (formValue.status === OrderStatusEnum.管理员下单失败) ElMessage.error('管理员下单失败');
      adminPurchaseVisible.value = false;
      getListFun();
    } catch (err) {
      console.log(err);
    }
  });
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
