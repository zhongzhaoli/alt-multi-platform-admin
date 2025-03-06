<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getUserList"
        @reset="getUserList"
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
        :handle="{
          show: true
        }"
        :pagination="{
          total
        }"
        :loading="loading"
        @table-refresh="getUserList"
        @page-change="getUserList"
      >
        <template #handle-left>
          <div v-loading="totalLoading" class="d-flex align-center">
            <el-button :disabled="orderTotal === 0" type="primary" @click="deliverFun('new')">
              一键自动分发
            </el-button>
            <div class="orderTotal">
              <span class="refresh" @click="refreshOrderTotal">
                <el-icon size="13"><Refresh /></el-icon>
              </span>
              <span>
                剩余 <b>{{ orderTotal }}</b> 个订单未分发
              </span>
            </div>
          </div>
        </template>
        <template #table-action="{ row }">
          <el-button link type="primary" @click="handerDistribution(row)">手动分发</el-button>
        </template>
      </TsxElementTable>
    </div>
    <ConfirmDialog
      v-model="distributeListVisible"
      class="distributeOrderDialog"
      title="手动分发"
      @submit="handerHandDelivery"
      @closed="tempDistributeUser = null"
    >
      <template v-if="tempDistributeUser">
        <DistributeOrder
          :role-name="tempDistributeUser.role_name"
          :role-id="tempDistributeUser.role_id"
          @selection-change="tableSelection"
        />
      </template>
    </ConfirmDialog>
    <ConfirmDialog
      v-model="deliverSuccessVisible"
      title="等待分发确认"
      width="450px"
      @closed="tempDeliverDialogClosed"
      @submit="deliverOrderFun"
    >
      <el-table v-loading="tempDeliverLoading" size="small" :data="deliverSuccessList" border>
        <el-table-column align="center" label="用户名" prop="username" />
        <el-table-column align="center" label="角色名" prop="role_name" />
        <el-table-column align="center" label="分发订单数量" prop="number">
          <template #default="{ row }">
            <b>{{ row.number || 0 }}</b>
          </template>
        </el-table-column>
      </el-table>
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import {
  getDistributeUserList,
  getDeliveryOrder,
  autoDeliveryNumber,
  handDeliveryOrder,
  autoDeliveryOrder
} from '@/api/order/distribute';
import type {
  DeliveryOrderProps,
  DeliveryOrderSuccessProps,
  DistributeUserProps
} from '@/api/order/distribute';
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { Refresh } from '@element-plus/icons-vue';
import DistributeOrder from './components/DistributeOrder.vue';
import * as config from './config';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { ref, shallowRef, unref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { ElMessage } from 'element-plus';
import { useMessageBox } from '@/hooks/useMessageBox';

// 获取用户列表
const loading = shallowRef(true);
const tableData = shallowRef<DistributeUserProps[]>([]);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const filterValue = ref<Partial<config.FilterDto>>({});
const getUserList = async () => {
  loading.value = true;
  try {
    const { data } = await getDistributeUserList({
      page: unref(page),
      page_size: unref(pageSize),
      ...unref(filterValue)
    });
    tableData.value = data?.list || [];
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

// 手动分发
const distributeListVisible = shallowRef(false);
const tempDistributeUser = shallowRef<DistributeUserProps | null>(null);
const selectionOrderList = ref<DeliveryOrderProps[]>([]);
const tempOrderType = shallowRef<'fail' | 'new'>('new');
const handerDistribution = (row: DistributeUserProps) => {
  tempDistributeUser.value = row;
  distributeListVisible.value = true;
};
const tableSelection = (obj: { rows: DeliveryOrderProps[]; orderType: 'fail' | 'new' }) => {
  selectionOrderList.value = obj.rows;
  tempOrderType.value = obj.orderType;
};
const handerHandDelivery = async () => {
  useMessageBox(`确认分发这${unref(selectionOrderList).length}笔订单吗？`, async () => {
    if (!tempDistributeUser.value) return ElMessage.error('请选择分发人员');
    try {
      await handDeliveryOrder({
        order_list: unref(selectionOrderList).map((item) => ({
          shop_id: item.shop_id,
          platform: item.platform,
          platform_order_id: item.platform_order_id,
          customer_order_id: item.customer_order_id
        })),
        user_id: tempDistributeUser.value.user_id,
        status: tempOrderType.value
      });
      ElMessage.success('分发成功');
      selectionOrderList.value = [];
      distributeListVisible.value = false;
      getUserList();
      getOrderList();
    } catch (err) {
      console.log(err);
    }
  });
};

// 获取订单数量
const orderTotal = shallowRef(0);
const totalLoading = shallowRef(true);
const getOrderList = async (message = false) => {
  totalLoading.value = true;
  try {
    const { data } = await getDeliveryOrder({ page: 1 });
    orderTotal.value = data?.total || 0;
    if (message) ElMessage.success('刷新成功');
  } catch (err) {
    console.log(err);
  } finally {
    totalLoading.value = false;
  }
};

// 自动分发
const deliverSuccessVisible = shallowRef(false);
const deliverSuccessList = ref<DeliveryOrderSuccessProps[]>([]);
const tempKey = shallowRef<'fail' | 'new' | null>(null);
const tempDeliverLoading = shallowRef(false);
const deliverFun = async (key: 'fail' | 'new') => {
  deliverSuccessVisible.value = true;
  tempKey.value = key;
  tempDeliverLoading.value = true;
  try {
    const { data } = await autoDeliveryNumber({ type: key });
    deliverSuccessList.value = data || [];
  } catch (err) {
    console.log(err);
  } finally {
    tempDeliverLoading.value = false;
  }
};
const tempDeliverDialogClosed = () => {
  deliverSuccessList.value = [];
  tempKey.value = null;
  tempDeliverLoading.value = false;
};
const deliverOrderFun = () => {
  useMessageBox(`是否确认分发这些订单？`, async () => {
    if (!tempKey.value) return ElMessage.error('请选择分发类型');
    if (!deliverSuccessList.value.length) return ElMessage.error('没有订单可分发');
    try {
      await autoDeliveryOrder({ user_list: deliverSuccessList.value, type: tempKey.value });
      ElMessage.success('分发成功');
      deliverSuccessVisible.value = false;
      getUserList();
      getOrderList();
    } catch (err) {
      ElMessage.error('分发失败');
      console.log(err);
    }
  });
};

// 刷新订单数量 - 防抖
const debouncedFn = useDebounceFn(() => {
  getOrderList(true);
}, 300);
const refreshOrderTotal = () => {
  debouncedFn();
};

getUserList();
getOrderList();
</script>
<style lang="scss" scoped>
.container {
  & > .tableBox {
    & .orderTotal {
      font-size: 13px;
      color: #a0a0a0;
      margin-left: var(--normal-padding);
      display: inline-flex;
      & > span {
        display: inline-block;
        height: 14px;
        line-height: 14px;
        & > b {
          color: #333;
        }
      }
      & > .refresh {
        margin-right: 4px;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          color: var(--el-color-primary);
          transform: rotate(90deg);
        }
      }
    }
  }
}
</style>
<style lang="scss">
.distributeOrderDialog {
  width: calc(100% - 300px);
  height: calc(100vh - 100px);
  margin: 50px 0 0 150px;
  display: flex;
  flex-direction: column;
  & > .el-dialog__body {
    height: calc(100% - 72px - 72px);
    overflow: auto;
    & .tableBox {
      margin-top: var(--normal-padding);
    }
  }
}
</style>
