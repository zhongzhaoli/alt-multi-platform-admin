<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      >
        <template #shop_id="{ form, row }">
          <SelectTiktokStore v-model="form[row.prop]" multiple @change="getListFun" />
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
          treeProps: {
            hasChildren: 'has_children',
            children: 'childrens'
          }
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
        @handle-right-click="handleRightClick"
        @sort-change="sortChange"
      >
        <template #handle-left>
          <div class="handleLeftBox d-flex align-center">
            <div class="frequencyText">更新频率：实时更新</div>
          </div>
        </template>
        <template #table-orderSn="{ row }">
          <RenderCopyIcon :text="row.order_id" type="primary" title="ASIN" margin="r" />{{
            row.order_id
          }}
        </template>
        <template #table-productInfo="{ row }">
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
                      text: item.seller_sku,
                      prefix: 'SKU'
                    }
                  ]"
                />
                <div class="quantityAmount"> x{{ item.order_line_quantity_amount || 1 }} </div>
              </div>
            </template>
          </div>
        </template>
        <template #table-sale_price="{ row }">
          <div class="multipleProductBox">
            <template v-for="item in row.children" :key="`sale_price_${item.order_line_item_id}`">
              <PriceItem :cent="false" bold :price="item.sale_price" />
            </template>
          </div>
        </template>
        <template #table-item_tax="{ row }">
          <div class="multipleProductBox">
            <template v-for="item in row.children" :key="`item_tax_${item.order_line_item_id}`">
              <div>
                <b>
                  <PriceItem
                    :cent="false"
                    bold
                    :price="
                      item.item_tax.reduce(
                        (pre: number, next: TaxItem) => pre + parseFloat(next.tax_amount),
                        0
                      )
                    "
                  />
                </b>
              </div>
            </template>
          </div>
        </template>
        <template #table-address="{ row }">
          <TextEllipsis :text="`${row.buyer_name} (${row.buyer_phone_number})`" />
          <div class="d-flex w-100">
            <RenderCopyIcon type="primary" :text="`${row.postal_code}`" title="邮编" margin="r" />{{
              row.postal_code
            }}
            <span style="padding: 0 4px">-</span>
            <TextEllipsis :text="`${row.buyer_full_address}`" />
          </div>
        </template>
        <template #table-logisticsInfo="{ row }">
          <div>{{ row.shipping_provider || '-' }}</div>
          <template v-if="row.tracking_number">
            <TextEllipsis :text="row.tracking_number || '-'" />
          </template>
        </template>
        <template #table-remark="{ row }">
          <TextEllipsis :text="row.buyer_message || '-'" :line="2" />
        </template>
        <template #table-action="{ row }">
          <template v-if="row.status === TiktokStausEnum.AWAITING_SHIPMENT">
            <el-button link type="primary" @click="singleDeliver(row)"> 发货 </el-button>
            <!-- <el-button link type="primary" @click="cancelOrder(row)"> 取消 </el-button> -->
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
      :submit-loading="submitLoading"
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
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
import SelectTiktokStore from '@/components/SelectTiktokStore/index.vue';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { carrierList } from '../carrier';
import { downloadCore, generateVisualNumber, RenderCopyIcon } from '@/utils/index';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import ProductItem from '@/components/ProductItem/index.vue';
import * as config from './config';
import { ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import PriceItem from '@/components/PriceItem/index.vue';
import {
  getTiktokOrderList,
  deliverProducts,
  TiktokOrderProps,
  type TiktokOrderFilterProps,
  TiktokStausEnum,
  exportTiktokOrderList,
  GetOrderDto,
  TaxItem,
  DeliverProductsDto
} from '@/api/order/tiktok';
import { cloneDeep } from 'lodash-es';
import axios, { CancelTokenSource } from 'axios';
import { useFullLoading } from '@/hooks/useFullLoading';
import { ElMessage } from 'element-plus';

defineOptions({
  name: 'OrderTiktok'
});

// 排序条件变化
const sortOrder = shallowRef<{ [key: string]: 'DESC' | 'ASC' } | null>(null);
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
const tableData = shallowRef<TiktokOrderProps[]>([]);
const loading = shallowRef(false);
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
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
    tableData.value = (data?.list || []).map((item) => ({ ...item, shipping_provider_id: '' }));
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
getListFun();

// 发货
const dialogVisible = shallowRef(false);
const submitLoading = shallowRef(false);
const selectedRows = ref<TiktokOrderProps[]>([]);
const singleDeliver = (row: TiktokOrderProps) => {
  selectedRows.value = [cloneDeep(row)];
  dialogVisible.value = true;
};
const dialogClosed = () => {
  batchName.value = '';
  batchNumber.value = '';
  selectedRows.value = [];
};
const dialogSubmit = async () => {
  submitLoading.value = true;
  const carrierNameIsEmpty = selectedRows.value.some((row) => !row.shipping_provider_id);
  const trackingNumberIsEmpty = selectedRows.value.some((row) => !row.tracking_number);
  if (carrierNameIsEmpty || trackingNumberIsEmpty) {
    return ElMessage.warning('请填写物流承运商或物流追踪号');
  }
  const { shop_id, order_id, shipping_provider_id, tracking_number, children } =
    selectedRows.value[0];
  const deliverList: DeliverProductsDto = {
    shop_id: shop_id,
    order_id: order_id,
    shipping_provider_id: shipping_provider_id,
    tracking_number: tracking_number,
    order_line_item_ids: children.map((item) => item.order_line_item_id)
  };
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
const batchName = shallowRef('');
const batchNumber = shallowRef('');
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
