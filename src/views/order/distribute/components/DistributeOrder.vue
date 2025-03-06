<template>
  <div class="componetContainer">
    <TsxElementTable
      v-model:current-page="page"
      v-model:page-size="pageSize"
      :table-columns="config.tableColumns"
      :handle="{ show: true }"
      :table="{
        data: tableData,
        loading,
        border: true,
        rowKey: (row: DeliveryOrderProps) => row.shop_id + row.platform_order_id
      }"
      :pagination="{ total }"
      @table-refresh="getListFun"
      @page-change="getListFun"
      @selection-change="tableSelection"
    >
      <template #handle-left>
        <div class="d-flex align-center">
          <el-radio-group v-model="orderType" @change="getListFun">
            <el-radio-button label="未下单" value="new" />
            <el-radio-button v-if="showFailOrder" label="下单失败" value="fail" />
          </el-radio-group>
          <el-select
            v-model="priceType"
            placeholder="订单金额"
            class="priceTypeSelect"
            @change="getListFun"
          >
            <el-option value="<=70" label="小于70美元" />
            <el-option value=">70" label="大于等于70美元" />
          </el-select>
        </div>
      </template>
    </TsxElementTable>
  </div>
</template>
<script setup lang="ts">
import { DeliveryOrderProps, getDeliveryOrder, GetDeliveryOrderDto } from '@/api/order/distribute';
import TsxElementTable from 'tsx-element-table';
import * as config from './config';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { computed, ref, shallowRef, watch } from 'vue';

interface ComponentProps {
  roleName: string;
  roleId: string;
}
export interface ComponentInstance {
  refresh: () => void;
}
const props = defineProps<ComponentProps>();
const emits = defineEmits(['selection-change']);

const total = shallowRef(0);
const tableData = shallowRef<DeliveryOrderProps[]>([]);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const loading = shallowRef(false);
const priceType = ref<'<=70' | '>70' | null>(null);
const orderType = ref<'new' | 'fail'>('new');
const getListFun = async () => {
  loading.value = true;
  try {
    const searchParams: GetDeliveryOrderDto = {
      page: page.value,
      page_size: pageSize.value,
      role_name: props.roleName,
      role_id: props.roleId,
      status: orderType.value
    };
    if (priceType.value) {
      searchParams.price_type = priceType.value;
    }
    const { data } = await getDeliveryOrder(searchParams);
    total.value = data?.total || 0;
    tableData.value = data?.list || [];
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const showFailOrder = computed(() => {
  return props.roleName.indexOf('老号下单员') > -1;
});

// 表格选择
const tableSelection = (rows: DeliveryOrderProps[]) => {
  emits('selection-change', { rows, orderType: orderType.value });
};

watch(
  [() => props.roleId, () => props.roleName],
  () => {
    getListFun();
  },
  {
    immediate: true,
    deep: true
  }
);

defineExpose({
  refresh: getListFun
});
</script>
<style lang="scss" scoped>
.componetContainer {
  height: 100%;
  & .priceTypeSelect {
    width: 200px;
    margin-left: var(--normal-padding);
  }
}
</style>
