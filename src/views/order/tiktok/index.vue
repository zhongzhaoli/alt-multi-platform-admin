<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      >
        <!-- <template #shopId="{ form, row }">
          <SelectTiktokStore v-model="form[row.prop]" @change="getListFun" />
        </template> -->
      </FilterContainer>
    </div>
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true,
          rowKey: 'id',
          loading
        }"
        :handle="{
          show: true,
          rightColumns: config.handleRightColumns
        }"
        :pagination="{
          total
        }"
        @table-refresh="getListFun"
        @page-change="getListFun"
        @selection-change="selectionChange"
        @handle-right-click="handleRightClick"
        @sort-change="sortChange"
      >
        <template #handle-left>
          <div class="handleLeftBox d-flex align-center">
            <el-button type="warning" @click="multipleDeliver"> 批量发货 </el-button>
            <div class="vr" />
            <div class="frequencyText">更新频率：每天</div>
          </div>
        </template>
        <template #table-orderSn="{ row }">
          <RenderCopyIcon :text="row.order_id" type="primary" title="ASIN" margin="r" />{{
            row.order_id
          }}
        </template>
        <template #table-productInfo="{ row }">
          <div class="d-flex align-center">
            <ProductItem
              class="productItem"
              :image-url="row.sku_image"
              :product-name="row.product_name"
              :desc-list="[
                {
                  text: row.seller_sku,
                  prefix: 'MSKU'
                }
              ]"
            />
            <div class="quantityAmount">x1</div>
          </div>
        </template>
        <template #table-asin="{ row }">
          <RenderCopyIcon :text="row.asin" type="primary" title="ASIN" margin="r" />{{ row.asin }}
        </template>
        <template #table-address="{ row }">
          <div>{{ row.buyer_phone_number }}</div>
          <TextEllipsis :text="`${row.buyer_full_address}`" />
        </template>
        <template #table-logisticsInfo="{ row }">
          <div>{{ row.shipping_provider_id || '-' }}</div>
          <template v-if="row.tracking_number">
            <TextEllipsis :text="row.tracking_number || '-'" />
          </template>
        </template>
        <template #table-remark="{ row }">
          <TextEllipsis :text="row.buyer_message || '-'" :line="2" />
        </template>
        <template #table-action="{ row }">
          <template v-if="row.order_status === TiktokStausEnum.AWAITING_SHIPMENT">
            <el-button link type="primary" @click="singleDeliver(row)"> 发货 </el-button>
            <el-button link type="primary" @click="cancelOrder(row)"> 取消 </el-button>
          </template>
          <template v-else>-</template>
        </template>
      </TsxElementTable>
    </div>
    <ConfirmDialog
      v-model="dialogVisible"
      top="10vh"
      width="700px"
      title="订单发货"
      @closed="dialogClosed"
      @submit="dialogSubmit"
    >
      <div class="dialogPsBox">
        <div class="title">注意事项：</div>
        <div class="desc"> 1、翻页会自动存储已填写的发货信息，请至少填写一条订单的发货信息。 </div>
        <div class="desc">
          2、批量设置时，会统一设置当前页所有订单的物流承运商，新一页数据需要重新批量设置。
        </div>
        <div class="desc">3、物流号与物流承运商都置空时，不会发货此订单。</div>
        <div class="desc">
          4、如出现提示发货信息不正确，请检查对应订单号下的物流号和物流承运商是否为空。
        </div>
      </div>
      <div class="d-flex batchSettingBox">
        <div>
          <el-select v-model="batchName" placeholder="物流承运商">
            <el-option
              v-for="item in carrierList"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            >
              {{ item.name }}
            </el-option>
          </el-select>
        </div>
        <div><el-input v-model="batchNumber" placeholder="物流追踪号" /></div>
        <div class="buttonBox">
          <el-button type="primary" @click="batchSetting">批量设置</el-button>
        </div>
      </div>
      <el-table :data="selectedRows" :max-height="400" border>
        <el-table-column label="订单号" align="center" prop="order_id">
          <template #default="{ row }">
            <el-input v-model="row.order_id" disabled />
          </template>
        </el-table-column>
        <el-table-column label="物流承运商" align="center" prop="shipping_provider_id">
          <template #default="{ row }">
            <el-select v-model="row.shipping_provider_id" placeholder="物流承运商">
              <el-option
                v-for="item in carrierList"
                :key="item.id"
                :value="item.id"
                :label="item.name"
              >
                {{ item.name }}
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="物流追踪号" align="center" prop="tracking_number">
          <template #default="{ row }">
            <el-input v-model="row.tracking_number" placeholder="物流追踪号" />
          </template>
        </el-table-column>
      </el-table>
    </ConfirmDialog>
    <ConfirmDialog v-model="cancelVisible" width="400px" title="取消订单" @submit="cancelSubmit">
      <template v-if="tempRow">
        <el-input
          v-model="tempRow.cancel_reason"
          type="textarea"
          placeholder="请输入取消原因"
          :rows="4"
        />
      </template>
      <template v-else>请选择订单</template>
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
// import SelectTiktokStore from '@/components/SelectTiktokStore/index.vue';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { carrierList } from '../carrier';
import { downloadCore, generateVisualNumber, RenderCopyIcon } from '@/utils/index';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import ProductItem from '@/components/ProductItem/index.vue';
import * as config from './config';
import { ref } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import {
  getTiktokOrderList,
  deliverProducts,
  DeliverProductsDto,
  TiktokOrderProps,
  type TiktokOrderFilterProps,
  TiktokStausEnum,
  exportTiktokOrderList,
  GetOrderDto,
  CancelOrderDto,
  cancelOrder as cancelOrderApi
} from '@/api/order/tiktok';
import { cloneDeep } from 'lodash-es';
import { ElMessage } from 'element-plus';
import axios, { CancelTokenSource } from 'axios';
import { useFullLoading } from '@/hooks/useFullLoading';

// 排序条件变化
const sortOrder = ref<{ [key: string]: 'DESC' | 'ASC' } | null>(null);
const sortChange = (data: { column: any; prop: string; order: any }) => {
  if (!data.order) {
    sortOrder.value = null;
  } else {
    sortOrder.value = {
      [data.prop]: data.order === 'ascending' ? 'ASC' : 'DESC'
    };
  }
  getListFun();
};

// 获取列表
const filterValue = ref<Partial<TiktokOrderFilterProps>>({});
const tableData = ref<TiktokOrderProps[]>([]);
const loading = ref(false);
const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const total = ref(0);
const getListFun = async () => {
  loading.value = true;
  try {
    const searchParams: GetOrderDto = {
      page: currentPage.value,
      page_size: pageSize.value,
      ...filterValue.value
    };
    if (sortOrder.value) {
      searchParams.sort = JSON.stringify(sortOrder.value);
    }
    const { data } = await getTiktokOrderList(searchParams);
    tableData.value = data?.list || [];
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
getListFun();

// 多选
const selectionList = ref<TiktokOrderProps[]>([]);
const selectionChange = (rows: TiktokOrderProps[]) => {
  selectionList.value = cloneDeep(rows);
};

// 取消订单
const cancelVisible = ref(false);
interface CancelOrderProps extends TiktokOrderProps {
  cancel_reason: string;
}
const tempRow = ref<CancelOrderProps | null>(null);
const cancelOrder = (row: TiktokOrderProps) => {
  tempRow.value = {
    ...row,
    cancel_reason: ''
  };
  cancelVisible.value = true;
};
const cancelSubmit = async () => {
  if (!tempRow.value) return ElMessage.warning('请选择订单');
  const requestData: CancelOrderDto = {
    order_id: tempRow.value.order_id,
    cancel_reason: tempRow.value.cancel_reason || '',
    order_line_item_ids: [tempRow.value.order_line_item_id],
    shop_id: tempRow.value.shop_id,
    skus: [{ sku_id: tempRow.value.sku_id, quantity: 1 }]
  };
  submitLoading.value = true;
  try {
    await cancelOrderApi([requestData]);
    ElMessage.success('取消成功');
    cancelVisible.value = false;
    tempRow.value = null;
    getListFun();
  } catch (err) {
    console.log(err);
  } finally {
    submitLoading.value = false;
  }
};

// 发货
const dialogVisible = ref(false);
const submitLoading = ref(false);
const selectedRows = ref<TiktokOrderProps[]>([]);
const singleDeliver = (row: TiktokOrderProps) => {
  selectedRows.value = [cloneDeep(row)];
  dialogVisible.value = true;
};
const multipleDeliver = () => {
  if (!selectionList.value.length) return ElMessage.warning('请选择订单');
  selectedRows.value = cloneDeep(selectionList.value);
  dialogVisible.value = true;
};
const dialogClosed = () => {
  batchName.value = '';
  batchNumber.value = '';
  selectedRows.value = [];
};
const dialogSubmit = async () => {
  const carrierNameIsEmpty = selectedRows.value.some((row) => !row.shipping_provider_id);
  const trackingNumberIsEmpty = selectedRows.value.some((row) => !row.tracking_number);
  if (carrierNameIsEmpty || trackingNumberIsEmpty) {
    return ElMessage.warning('请填写物流承运商或物流追踪号');
  }
  submitLoading.value = true;
  const deliverList: DeliverProductsDto[] = selectedRows.value.map((row) => ({
    shop_id: row.shop_id,
    order_id: row.order_id,
    shipping_provider_id: row.shipping_provider_id,
    tracking_number: row.tracking_number,
    order_line_item_ids: [row.order_line_item_id]
  }));
  try {
    await deliverProducts(deliverList);
    ElMessage.success('发货成功');
    dialogVisible.value = false;
    getListFun();
  } catch (err) {
    console.log(err);
  } finally {
    submitLoading.value = false;
  }
};

// 导出
const cancelToken = axios.CancelToken;
let source: CancelTokenSource;
const fullLoading = useFullLoading();
const handleRightClick = async () => {
  source = cancelToken.source();
  fullLoading.open();
  try {
    const data = await exportTiktokOrderList(
      {
        page: currentPage.value,
        page_size: pageSize.value,
        ...filterValue.value,
        export: 1
      },
      source.token
    );
    downloadCore(data, `Tiktok订单列表 - ${generateVisualNumber()}.xlsx`);
  } catch (err) {
    console.log(err);
  } finally {
    fullLoading.close();
  }
};

// 批量设置
const batchName = ref('');
const batchNumber = ref('');
const batchSetting = () => {
  if (!selectedRows.value.length) return ElMessage.warning('未选择订单');
  selectedRows.value.forEach((row: TiktokOrderProps) => {
    row.shipping_provider_id = batchName.value;
    row.tracking_number = batchNumber.value;
  });
};
</script>
<style lang="scss" scoped>
.container {
  & > .tableBox {
    & .productItem {
      flex: 1;
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
    & .handleLeftBox {
      & > .vr {
        width: 2px;
        height: 20px;
        background-color: #eaeaea;
        margin: 0 12px;
      }
    }
  }
  & .batchSettingBox {
    display: flex;
    align-items: center;
    margin: 0 -6px;
    margin-bottom: var(--normal-padding);
    & > div {
      flex: 1;
      margin: 0 6px;
      &.buttonBox {
        flex: unset;
        width: unset;
      }
    }
  }
}
</style>
