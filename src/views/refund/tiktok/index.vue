<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
      >
        <!-- <template #shopId="{ form, row }"> -->
        <!-- <SelectTiktokStore v-model="form[row.prop]" @change="getListFun" /> -->
        <!-- </template> -->
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
        @handle-right-click="handleRightClick"
      >
        <template #handle-left>
          <div class="frequencyText">更新频率：每 3 个小时</div>
        </template>
        <template #table-order_id="{ row }">
          <RenderCopyIcon
            :text="row.order_id"
            type="primary"
            title="订单号"
            margin="r"
          />{{ row.order_id }}
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
                  prefix: 'MSKU',
                },
              ]"
            />
            <div class="quantityAmount">x1</div>
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
  exportTiktokRefundOrderList,
} from "@/api/refund/tiktok";
import {
  downloadCore,
  generateVisualNumber,
  RenderCopyIcon,
} from "@/utils/index";
import { useMessageBox } from "@/hooks/useMessageBox";
import { ElMessage } from "element-plus";
import axios, { CancelTokenSource } from "axios";
import { useFullLoading } from "@/hooks/useFullLoading";

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
      page_size: pageSize.value,
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

// 导出
const cancelToken = axios.CancelToken;
let source: CancelTokenSource;
const fullLoading = useFullLoading();
const handleRightClick = async () => {
  source = cancelToken.source();
  fullLoading.open();
  try {
    const data = await exportTiktokRefundOrderList(
      {
        page: currentPage.value,
        page_size: pageSize.value,
        ...filterValue.value,
        export: 1,
      },
      source.token,
    );
    downloadCore(data, `Tiktok退货订单列表 - ${generateVisualNumber()}.xlsx`);
  } catch (err) {
    console.log(err);
  } finally {
    fullLoading.close();
  }
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
