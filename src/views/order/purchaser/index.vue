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
            <el-dropdown @command="deliverFun">
              <el-button type="primary">
                一键自动分发
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="new">新订单</el-dropdown-item>
                  <el-dropdown-item command="fail">老订单</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
    <ConfirmDialog v-model="purchaserListVisible" class="purchaserOrderDialog" title="手动分发">
      <template v-if="tempPurchaserUser">
        <PurchaserOrder
          :role-name="tempPurchaserUser.role_name"
          :role-id="tempPurchaserUser.role_id"
        />
      </template>
    </ConfirmDialog>
    <ConfirmDialog
      v-model="deliverSuccessVisible"
      title="等待分发确认"
      width="450px"
      @closed="tempDeliverDialogClosed"
      @confirm="deliverOrderFun"
    >
      <el-table size="small" :data="deliverSuccessList" border :loading="tempDeliverLoading">
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
import { getPurchaserUserList, getDeliveryOrder, deliveryOrder } from '@/api/order/purchaser';
import type { DeliveryOrderSuccessProps, PurchaserUserProps } from '@/api/order/purchaser';
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { Refresh, ArrowDown } from '@element-plus/icons-vue';
import PurchaserOrder from './components/PurchaserOrder.vue';
import * as config from './config';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { ref, shallowRef, unref } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import { ElMessage } from 'element-plus';
import { useMessageBox } from '@/hooks/useMessageBox';

// 获取用户列表
const loading = shallowRef(true);
const tableData = shallowRef<PurchaserUserProps[]>([]);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const filterValue = ref<Partial<config.FilterDto>>({});
const getUserList = async () => {
  loading.value = true;
  try {
    const { data } = await getPurchaserUserList({
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
const purchaserListVisible = shallowRef(false);
const tempPurchaserUser = shallowRef<PurchaserUserProps | null>(null);
const handerDistribution = (row: PurchaserUserProps) => {
  tempPurchaserUser.value = row;
  purchaserListVisible.value = true;
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
    const { data } = await deliveryOrder({ type: key });
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
  useMessageBox(`是否确认分发这些订单？`, async () => {});
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
.purchaserOrderDialog {
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
