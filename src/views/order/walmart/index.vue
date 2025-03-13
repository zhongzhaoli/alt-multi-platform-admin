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
          <SelectWalmartStore v-model="form[row.prop]" multiple @change="getListFun" />
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
          rowKey: (row: WalmartOrderProps) => row.purchase_order_id + row.customer_order_id,
          border: true,
          treeProps: {
            hasChildren: 'has_children',
            children: 'childrens'
          },
          loading
        }"
        :handle="{
          show: true,
          rightColumns: config.handleRightColumns
        }"
        :pagination="{
          total
        }"
        @selection-change="selectionChange"
        @table-refresh="getListFun"
        @page-change="getListFun"
        @sort-change="sortChange"
        @handle-right-click="handleRightClick"
      >
        <template #handle-left>
          <div class="handleLeftBox d-flex align-center">
            <el-button type="warning" @click="multipleDeliver"> 批量发货 </el-button>
            <div class="vr" />
            <div class="frequencyText">更新频率：实时更新</div>
          </div>
        </template>
        <template #table-orderNo="{ row }">
          <div class="d-inline-flex">
            PO：
            <RenderCopyIcon
              type="primary"
              :text="row.purchase_order_id"
              title="采购订单号"
              margin="r"
            />
            <TextEllipsis :line="1" placement="right" :text="`${row.purchase_order_id || '-'}`" />
          </div>
          <div class="d-inline-flex">
            CO：
            <RenderCopyIcon
              type="primary"
              :text="row.customer_order_id"
              title="客户订单号"
              margin="r"
            />
            <TextEllipsis :line="1" placement="right" :text="`${row.customer_order_id || '-'}`" />
          </div>
        </template>
        <template #table-productInfo="{ row }">
          <div class="multipleProductBox">
            <template v-for="item in row.children" :key="`${item.id}_${item.order_line_number}`">
              <div class="d-flex align-center">
                <ProductItem
                  class="productItem"
                  :image-url="item.product_image_url"
                  :product-name="item.product_name"
                  :size="40"
                  :desc-list="[
                    {
                      text: item.product_sku,
                      prefix: 'SKU'
                    }
                  ]"
                />
                <div class="quantityAmount"> x{{ item.order_line_quantity_amount || 0 }} </div>
              </div>
            </template>
          </div>
        </template>
        <template #table-order_line_status="{ row }">
          <div class="multipleProductBox">
            <template v-for="item in row.children" :key="`${item.id}_${item.order_line_number}`">
              <div>
                <el-text v-if="item.statusObject" :type="item.statusObject.type">
                  {{ item.statusObject.label }}
                </el-text>
                <el-text v-else>未知</el-text>
              </div>
            </template>
          </div>
        </template>
        <template #table-shop_name="{ row }">
          <TextEllipsis :text="row.shop_name" :line="2" />
        </template>
        <template #table-asin="{ row }">
          <div class="multipleProductBox">
            <template v-for="item in row.children" :key="`${item.id}_${item.order_line_number}`">
              <div>
                <template v-if="item.asin">
                  <RenderCopyIcon :text="item.asin" type="primary" title="ASIN" margin="r" />
                </template>
                {{ item.asin || '-' }}
              </div>
            </template>
          </div>
        </template>
        <template #table-product_charge_amount="{ row }">
          <div class="multipleProductBox">
            <template v-for="item in row.children" :key="`${item.id}_${item.order_line_number}`">
              <div>
                <b>$ {{ item.charge_amount }}</b>
              </div>
            </template>
          </div>
        </template>
        <template #table-charge_amount="{ row }">
          <div class="multipleProductBox">
            <template v-for="item in row.children" :key="`${item.id}_${item.order_line_number}`">
              <div>
                <b>$ {{ item.charge_amount }}</b>
              </div>
            </template>
          </div>
        </template>
        <template #table-charge_amount_product="{ row }">
          <div class="multipleProductBox">
            <template v-for="item in row.children" :key="`${item.id}_${item.order_line_number}`">
              <div>
                <b>$ {{ item.charge_amount_product }}</b>
              </div>
            </template>
          </div>
        </template>
        <template #table-charge_amount_shipping="{ row }">
          <div class="multipleProductBox">
            <template v-for="item in row.children" :key="`${item.id}_${item.order_line_number}`">
              <div>
                <b>$ {{ item.charge_amount_shipping.toFixed(2) }}</b>
              </div>
            </template>
          </div>
        </template>
        <template #table-taxFee="{ row }">
          <div class="multipleProductBox">
            <template v-for="item in row.children" :key="`${item.id}_${item.order_line_number}`">
              <div>
                <b>$ {{ item.totalTax.toFixed(2) }}</b>
              </div>
            </template>
          </div>
        </template>
        <template #table-address="{ row }">
          <TextEllipsis :text="`${row.postal_address_name} (${row.phone})`" />
          <TextEllipsis
            :text="`${row.postal_code} - ${row.postal_city} ${row.postal_state} ${row.postal_address1 || ''} ${row.postal_address2 || ''}`"
          />
        </template>
        <template #table-logisticsInfo="{ row }">
          <div>{{ row.carrier }}</div>
          <LinkItem :href="row.tracking_url" :text="row.tracking_number" />
        </template>
        <template #table-action="{ row }">
          <div>
            <template
              v-if="
                row.children.every(
                  (item: WalmartOrderItemProps) =>
                    item.order_line_status === WalmartStausEnum.Created ||
                    item.order_line_status === WalmartStausEnum.Acknowledged
                )
              "
            >
              <el-button link type="primary" @click="singleDeliver(row)"> 发货 </el-button>
            </template>
            <template v-else>-</template>
          </div>
        </template>
      </TsxElementTable>
    </div>
    <ConfirmDialog
      v-model="dialogVisible"
      width="800px"
      top="10vh"
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
        <el-table-column label="客户订单号" align="center" prop="customer_order_id">
          <template #default="{ row }">
            <el-input v-model="row.customer_order_id" disabled />
          </template>
        </el-table-column>
        <el-table-column label="物流承运商" align="center" prop="carrier">
          <template #default="{ row }">
            <el-select v-model="row.carrier" placeholder="物流承运商">
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
import SelectWalmartStore from '@/components/SelectWalmartStore/index.vue';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { downloadCore, RenderCopyIcon } from '@/utils/index';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import { carrierList } from '../carrier';
import LinkItem from '@/components/LinkItem/index.vue';
import ProductItem from '@/components/ProductItem/index.vue';
import * as config from './config';
import { ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import {
  type WalmartOrderProps,
  getWalmartOrderList,
  deliverProducts,
  type DeliverProductsDto,
  type WalmartOrderFilterProps,
  type GetOrderDto,
  WalmartStausEnum,
  orderExport,
  WalmartOrderItemProps
} from '@/api/order/walmart';
import { cloneDeep } from 'lodash-es';
import { ElMessage } from 'element-plus';
import { useFullLoading } from '@/hooks/useFullLoading';
import axios, { CancelTokenSource } from 'axios';

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
const filterValue = ref<Partial<WalmartOrderFilterProps>>({});
const tableData = shallowRef<WalmartOrderProps[]>([]);
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
      searchParams.order = JSON.stringify([sortOrder.value]);
    }
    const { data } = await getWalmartOrderList(searchParams);
    tableData.value = (data?.list || []).map((item) => {
      return {
        ...item,
        children: (item.children || []).map((child) => {
          const statusItem = config.walmartStatusMap.find(
            (statusItem) => statusItem.value === child.order_line_status
          );
          return {
            ...child,
            statusObject: statusItem || null,
            totalTax: child.charge_amount_product_tax + child.charge_amount_shipping_tax
          };
        })
      };
    });
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
getListFun();

// 多选
const selectionList = shallowRef<WalmartOrderProps[]>([]);
const selectionChange = (rows: WalmartOrderProps[]) => {
  selectionList.value = cloneDeep(rows);
};

// 导出
const fullLoading = useFullLoading();
const cancelToken = axios.CancelToken;
let source: CancelTokenSource;
const handleRightClick = async () => {
  fullLoading.open();
  try {
    source = cancelToken.source();
    const data = await orderExport(filterValue.value, source.token);
    downloadCore(data, `订单列表.xlsx`);
  } catch (err) {
    console.log(err);
  } finally {
    fullLoading.close();
  }
};

// 发货
const dialogVisible = shallowRef(false);
const submitLoading = shallowRef(false);
interface SelectedRowsProps extends WalmartOrderProps {
  seller_order_id: string;
}
const selectedRows = ref<SelectedRowsProps[]>([]);
const singleDeliver = (row: WalmartOrderProps) => {
  selectedRows.value = [row].map((v) => {
    return {
      ...v,
      seller_order_id: ''
    };
  });
  dialogVisible.value = true;
};
const multipleDeliver = () => {
  if (!selectionList.value.length) return ElMessage.warning('请选择订单');
  selectedRows.value = selectionList.value.map((v) => {
    return {
      ...v,
      seller_order_id: ''
    };
  });
  dialogVisible.value = true;
};
const dialogClosed = () => {
  batchName.value = '';
  batchNumber.value = '';
  selectedRows.value = [];
};
const dialogSubmit = async () => {
  const carrierNameIsEmpty = selectedRows.value.some((row) => !row.carrier);
  const trackingNumberIsEmpty = selectedRows.value.some((row) => !row.tracking_number);
  if (carrierNameIsEmpty || trackingNumberIsEmpty) {
    return ElMessage.warning('请填写物流承运商或物流追踪号');
  }
  submitLoading.value = true;
  const deliverList: DeliverProductsDto[] = selectedRows.value.map((row) => ({
    carrier: row.carrier,
    tracking_number: row.tracking_number,
    purchase_order_id: row.purchase_order_id,
    shop_id: row.shop_id,
    seller_order_id: row.customer_order_id,
    children: row.children.map((v) => ({
      order_line_number: String(v.order_line_number),
      order_line_quantity_amount: String(v.order_line_quantity_amount)
    }))
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

// 批量设置
const batchName = shallowRef('');
const batchNumber = shallowRef('');
const batchSetting = () => {
  if (!selectedRows.value.length) return ElMessage.warning('未选择订单');
  selectedRows.value.forEach((row: SelectedRowsProps) => {
    row.carrier = batchName.value;
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
