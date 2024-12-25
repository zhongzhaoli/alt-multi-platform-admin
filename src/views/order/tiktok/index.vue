<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer :columns="config.filterColumns" />
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
        }"
        :pagination="{
          total,
        }"
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
        <template #table-orderNo="{ row }">
          <RenderCopyIcon
            :text="row.asin"
            type="primary"
            title="ASIN"
            margin="r"
          />{{ row.asin }}
        </template>
        <template #table-productInfo="{ row }">
          <div class="d-flex align-center">
            <ProductItem
              class="productItem"
              type="ordinary"
              :item="{
                imageUrl: row.productImageUrl,
                productName: row.productName,
                skuPrefix: 'MSKU：',
                sku: row.productSku,
              }"
            />
            <div class="quantityAmount">x{{ row.orderLineQuantity || 0 }}</div>
          </div>
        </template>
        <template #table-asin="{ row }">
          <RenderCopyIcon :text="row.asin" title="ASIN" margin="r" />{{
            row.asin
          }}
        </template>
        <template #table-address="{ row }">
          <div>{{ row.phone }}</div>
          <TextEllipsis
            :text="`${row.city} ${row.state} ${row.address1} ${row.address2}`"
          />
        </template>
        <template #table-logisticsInfo="{ row }">
          <div>{{ row.carrierName }}</div>
          <div>
            <a
              v-if="row.trackingNumber && row.trackingURL"
              class="numberHrefItem"
              :href="row.trackingURL"
              target="_blank"
            >
              <i class="ri-share-box-line" />
              <span class="productId">
                <TextEllipsis :text="row.trackingNumber" />
              </span>
            </a>
          </div>
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
      width="600px"
      title="订单发货"
      @closed="dialogClosed"
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
      <el-table :data="selectedRows" border>
        <el-table-column
          label="客户订单号"
          align="center"
          prop="customerOrderId"
        >
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
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { RenderCopyIcon } from '@/utils/index';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import ProductItem from '../components/productItem.vue';
import * as config from './config';
import { ref } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { TiktokOrderProps } from '@/api/order/tiktok';
import { cloneDeep } from 'lodash-es';
import { ElMessage } from 'element-plus';

// 或者列表
const tableData = ref<TiktokOrderProps[]>([
  {
    id: 1,
    shopName: '星与-沃尔玛-花仙兽',
    orderSn: '108933798083879',
    orderStatus: 'Created',
    productImageUrl:
      'https://i5.walmartimages.com/asr/69065a2c-7bde-441f-a287-950cf514087f.10bb29be470fcf9020b4672fa59e2d28.jpeg?odnWidth=300&odnHeight=300',
    productName:
      'Younghome Knife Set, 13 PCS Stainless Steel Kitchen Knife Block Set with Built-in Sharpener',
    productSku: 'Zoe-Knifeset-13',
    orderLineQuantity: 1,
    asin: '108936145814153',
    orderTime: '2024/08/01 12:00:00',
    updateTime: '2024/08/01 12:00:00',
    name: 'cynthia palma',
    phone: '9196215516',
    address1: '309 Southglen Drive',
    address2: null,
    remark: 'I want to receive the goods as soon as possible.',
    city: 'Cary',
    state: 'NC',
    carrierName: 'FedEx',
    trackingNumber: '745444571803',
    trackingURL: 'https://www.walmart.com/tracking?tracking_id=745444571803',
    totalAmount: 39.99,
    productAmount: 34.59,
    shippingFee: 4.4,
    taxFee: 1,
  },
]);
const loading = ref(false);
const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const total = ref(0);

// 多选
const selectionList = ref<TiktokOrderProps[]>([]);
const selectionChange = (rows: TiktokOrderProps[]) => {
  selectionList.value = cloneDeep(rows);
};

// 发货
const dialogVisible = ref(false);
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

// 批量设置
const batchName = ref('');
const batchNumber = ref('');
const batchSetting = () => {
  if (!selectedRows.value.length) return ElMessage.warning('未选择订单');
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
      margin-left: 10px;
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      font-size: 12px;
      background-color: #f6f6f6;
      border-radius: 6px;
    }
    & .numberHrefItem {
      color: var(--el-color-primary);
      transition: color 0.2s;
      display: inline-flex;
      &:hover {
        color: var(--el-color-primary-light-5);
      }
      & > .productId {
        margin-left: 4px;
        cursor: pointer;
      }
    }
    & .handleLeftBox {
      & > .vr {
        width: 2px;
        height: 20px;
        background-color: #eaeaea;
        margin: 0 12px;
      }
      & > .frequencyText {
        font-size: 14px;
        color: #bdbdbd;
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
