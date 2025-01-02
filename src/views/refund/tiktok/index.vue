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
      >
        <template #handle-left>
          <div class="frequencyText">更新频率：每 3 个小时</div>
        </template>
        <template #table-orderNo="{ row }">
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
        <template #table-reason="{ row }">
          <TextEllipsis :text="row.reason" :line="2" />
        </template>
        <template #table-action="{ row }">
          <el-button link type="primary" @click="cancelOrderFun(row.orderSn)">
            取消
          </el-button>
          <el-button
            link
            type="primary"
            @click="reviewRefundFun(row.orderSn, true)"
          >
            同意
          </el-button>
          <el-button
            link
            type="primary"
            @click="reviewRefundFun(row.orderSn, false)"
          >
            拒绝
          </el-button>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from "@/components/FilterContainer/index.vue";
import SelectTiktokStore from "@/components/SelectTiktokStore/index.vue";
import TsxElementTable from "tsx-element-table";
import ProductItem from "@/components/ProductItem/index.vue";
import TextEllipsis from "@/components/TextEllipsis/index.vue";
import * as config from "./config";
import { ref } from "vue";
import { PAGE, PAGE_SIZE } from "@/constants/app";
import {
  getTiktokRefundList,
  cancelOrder,
  reviewRefund,
  RefundTiktokProps,
  TiktokRefunFilterProps,
} from "@/api/refund/tiktok";
import { RenderCopyIcon } from "@/utils/index";
import { useMessageBox } from "@/hooks/useMessageBox";
import { ElMessage } from "element-plus";

const filterValue = ref<Partial<TiktokRefunFilterProps>>({});
const tableData = ref<RefundTiktokProps[]>([]);
const total = ref(0);
const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const loading = ref(false);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getTiktokRefundList({
      page: currentPage.value,
      pageSize: pageSize.value,
      ...filterValue.value,
    });
    tableData.value = data?.list || [];
    total.value = data?.total || 0;
    loading.value = false;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
getListFun();

// 取消订单
const cancelOrderFun = (orderSn: string) => {
  useMessageBox("确定取消订单吗？", async () => {
    try {
      await cancelOrder(orderSn);
      ElMessage.success("取消成功");
      getListFun();
    } catch (err) {
      console.log(err);
    }
  });
};

// 审核退款
const reviewRefundFun = (orderSn: string, review: boolean) => {
  useMessageBox(
    `确定 ${review ? "同意" : "拒绝"} 此订单的退款吗？`,
    async () => {
      try {
        await reviewRefund(orderSn, review);
        ElMessage.success("操作成功");
        getListFun();
      } catch (err) {
        console.log(err);
      }
    },
  );
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
  }
}
</style>
