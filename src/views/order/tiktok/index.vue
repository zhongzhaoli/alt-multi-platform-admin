<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
      >
        <template #shopId="{ form, row }">
          <SelectTiktokStore v-model="form[row.prop]" @change="getListFun" />
        </template>
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
          loading,
        }"
        :handle="{
          show: true,
          rightColumns: config.handleRightColumns,
        }"
        :pagination="{
          total,
        }"
        @table-refresh="getListFun"
        @page-change="getListFun"
        @selection-change="selectionChange"
      >
        <template #handle-left>
          <div class="handleLeftBox d-flex align-center">
            <el-button type="warning" @click="multipleDeliver">
              批量发货
            </el-button>
            <div class="vr" />
            <div class="frequencyText">更新频率：每天</div>
          </div>
        </template>
        <template #table-orderSn="{ row }">
          <RenderCopyIcon
            :text="row.orderSn"
            type="primary"
            title="ASIN"
            margin="r"
          />{{ row.orderSn }}
        </template>
        <template #table-productInfo="{ row }">
          <div class="d-flex align-center">
            <ProductItem
              class="productItem"
              :image-url="row.productImageUrl"
              :product-name="row.productName"
              :desc-list="[
                {
                  text: row.productSku,
                  prefix: 'MSKU：',
                },
              ]"
            />
            <div class="quantityAmount">x{{ row.orderLineQuantity || 0 }}</div>
          </div>
        </template>
        <template #table-asin="{ row }">
          <RenderCopyIcon
            :text="row.asin"
            type="primary"
            title="ASIN"
            margin="r"
          />{{ row.asin }}
        </template>
        <template #table-address="{ row }">
          <div>{{ row.phone }}</div>
          <TextEllipsis
            :text="`${row.city} ${row.state} ${row.address1 || ''} ${row.address2 || ''}`"
          />
        </template>
        <template #table-logisticsInfo="{ row }">
          <div>{{ row.carrierName }}</div>
          <LinkItem :href="row.trackingURL" :text="row.trackingNumber" />
        </template>
        <template #table-remark="{ row }">
          <TextEllipsis :text="row.remark || '-'" :line="2" />
        </template>
        <template #table-action="{ row }">
          <el-button link type="primary" @click="singleDeliver(row)">
            发货
          </el-button>
        </template>
      </TsxElementTable>
    </div>
    <ConfirmDialog
      v-model="dialogVisible"
      top="10vh"
      width="600px"
      title="订单发货"
      @closed="dialogClosed"
      @submit="dialogSubmit"
    >
      <div class="dialogPsBox">
        <div class="title">注意事项：</div>
        <div class="desc">
          1、翻页会自动存储已填写的发货信息，请至少填写一条订单的发货信息。
        </div>
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
          <el-input v-model="batchName" placeholder="请输入物流承运商" />
        </div>
        <div><el-input v-model="batchNumber" placeholder="物流追踪号" /></div>
        <div class="buttonBox">
          <el-button type="primary" @click="batchSetting">批量设置</el-button>
        </div>
      </div>
      <el-table :data="selectedRows" :max-height="400" border>
        <el-table-column label="订单号" align="center" prop="orderSn">
          <template #default="{ row }">
            <el-input v-model="row.orderSn" disabled />
          </template>
        </el-table-column>
        <el-table-column label="物流承运商" align="center" prop="carrierName">
          <template #default="{ row }">
            <el-input v-model="row.carrierName" placholder="物流承运商" />
          </template>
        </el-table-column>
        <el-table-column
          label="物流追踪号"
          align="center"
          prop="trackingNumber"
        >
          <template #default="{ row }">
            <el-input v-model="row.trackingNumber" placholder="物流追踪号" />
          </template>
        </el-table-column>
      </el-table>
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from "tsx-element-table";
import FilterContainer from "@/components/FilterContainer/index.vue";
import SelectTiktokStore from "@/components/SelectTiktokStore/index.vue";
import ConfirmDialog from "@/components/ConfirmDialog/index.vue";
import LinkItem from "@/components/LinkItem/index.vue";
import { RenderCopyIcon } from "@/utils/index";
import TextEllipsis from "@/components/TextEllipsis/index.vue";
import ProductItem from "@/components/ProductItem/index.vue";
import * as config from "./config";
import { ref } from "vue";
import { PAGE, PAGE_SIZE } from "@/constants/app";
import {
  getTiktokOrderList,
  deliverProducts,
  DeliverProductsDto,
  TiktokOrderProps,
  type TiktokOrderFilterProps,
} from "@/api/order/tiktok";
import { cloneDeep } from "lodash-es";
import { ElMessage } from "element-plus";

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
    const { datas } = await getTiktokOrderList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filterValue.value,
    });
    tableData.value = datas?.data || [];
    total.value = datas?.total || 0;
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

// 发货
const dialogVisible = ref(false);
const submitLoading = ref(false);
const selectedRows = ref<TiktokOrderProps[]>([]);
const singleDeliver = (row: TiktokOrderProps) => {
  selectedRows.value = [cloneDeep(row)];
  dialogVisible.value = true;
};
const multipleDeliver = () => {
  if (!selectionList.value.length) return ElMessage.warning("请选择订单");
  selectedRows.value = cloneDeep(selectionList.value);
  dialogVisible.value = true;
};
const dialogClosed = () => {
  batchName.value = "";
  batchNumber.value = "";
  selectedRows.value = [];
};
const dialogSubmit = async () => {
  const carrierNameIsEmpty = selectedRows.value.some((row) => !row.carrierName);
  const trackingNumberIsEmpty = selectedRows.value.some(
    (row) => !row.trackingNumber,
  );
  if (carrierNameIsEmpty || trackingNumberIsEmpty) {
    return ElMessage.warning("请填写物流承运商或物流追踪号");
  }
  submitLoading.value = true;
  const deliverList: DeliverProductsDto[] = selectedRows.value.map((row) => ({
    orderSn: row.orderSn,
    carrierName: row.carrierName,
    trackingNumber: row.trackingNumber,
  }));
  try {
    await deliverProducts(deliverList);
    ElMessage.success("发货成功");
    dialogVisible.value = false;
    getListFun();
  } catch (err) {
    console.log(err);
  } finally {
    submitLoading.value = false;
  }
};

// 批量设置
const batchName = ref("");
const batchNumber = ref("");
const batchSetting = () => {
  if (!selectedRows.value.length) return ElMessage.warning("未选择订单");
  selectedRows.value.forEach((row: TiktokOrderProps) => {
    row.carrierName = batchName.value;
    row.trackingNumber = batchNumber.value;
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
