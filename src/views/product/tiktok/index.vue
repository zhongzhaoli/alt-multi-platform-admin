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
          loading
        }"
        :handle="{
          show: true,
          rightColumns: config.handleRightColumns
        }"
        :pagination="{
          total
        }"
        @page-change="getListFun"
        @table-refresh="getListFun"
      >
        <template #handle-left>
          <div class="frequencyText">更新频率：每 6 个小时</div>
        </template>
        <template #table-shopId="{ row }">
          <RenderCopyIcon :text="row.shopId" type="primary" title="店铺ID" margin="r" />{{
            row.shopId
          }}
        </template>
        <template #table-productInfo="{ row }">
          <ProductItem
            class="productItem"
            type="ordinary"
            :size="60"
            :image-url="row.productImageUrl"
            :product-name="row.new_title"
            :token="true"
            :desc-list="[
              {
                text: row.product_id,
                prefix: 'ID'
              },
              {
                text: row.global_product_id,
                prefix: 'Global ID'
              }
            ]"
          />
        </template>
        <template #table-sku="{ row }">
          <div class="d-flex justify-center align-center">
            <RenderCopyIcon :text="row.sku_id" type="primary" title="SKU" margin="r" />
            <span class="warehouses_id">{{ row.sku_id }}</span>
          </div>
          <div class="d-flex justify-center align-center">
            <RenderCopyIcon :text="row.global_sku_id" type="primary" title="全球 SKU" margin="r" />
            <span class="warehouses_id">{{ row.global_sku_id }}</span>
          </div>
        </template>
        <template #table-seller_sku="{ row }">
          <div class="d-inline-flex justify-center align-center">
            <RenderCopyIcon :text="row.seller_sku" type="primary" title="卖家 SKU" margin="r" />
            <span class="warehouses_id">
              <TextEllipsis :text="row.seller_sku" :line="1" />
            </span>
          </div>
        </template>
        <template #table-shipping_fee="{ row }">
          <div>
            <b>$ {{ row.shipping_fee.toFixed(2) }}</b>
          </div>
          <div class="d-flex justify-center align-center">
            <RenderCopyIcon :text="row.warehouses_id" type="primary" title="仓库ID" margin="r" />
            <span class="warehouses_id">{{ row.warehouses_id }}</span>
          </div>
        </template>
        <template #table-asin="{ row }">
          <TextEllipsis :text="row.asin" :line="1" />
          <TextEllipsis :text="row.pasin" :line="1" bold />
          <!-- <TextEllipsis :text="row.seller_sku" :line="1" /> -->
        </template>
        <template #table-stockWarning="{ row }">
          <el-tag
            disable-transitions
            effect="plain"
            :type="row.stockWarning ? 'primary' : 'danger'"
          >
            {{ row.stockWarning ? '库存正常' : '库存低于 5 个' }}
          </el-tag>
        </template>
        <template #table-action="{ row }">
          <el-button link type="primary" @click="openInventoryDialog(row)">修改库存</el-button>
        </template>
      </TsxElementTable>
    </div>
    <ConfirmDialog
      v-model="inventoryVisible"
      title="修改库存"
      width="300px"
      @submit="updateInventoryFun"
      @closed="dialogClosed"
    >
      <el-form
        ref="formRef"
        :model="updateInfo"
        label-position="top"
        :rules="config.updateInventoryRules"
      >
        <el-form-item prop="stock" label="库存数量：">
          <el-input-number
            v-model="updateInfo.stock"
            class="stockInputNumber"
            placeholder="库存数量"
            :controls="false"
            :max="50"
            :min="0"
          />
        </el-form-item>
      </el-form>
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from '@/components/FilterContainer/index.vue';
import TsxElementTable from 'tsx-element-table';
import SelectTiktokStore from '@/components/SelectTiktokStore/index.vue';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import * as config from './config';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { ref, shallowRef } from 'vue';
import {
  getTiktokProductList,
  type TiktokProductProps,
  type TiktokProductFilterProps,
  tiktokImageUrl,
  updateInventory,
  UpdateInventoryDto
} from '@/api/product/tiktok';
import ProductItem from '@/components/ProductItem/index.vue';
import { RenderCopyIcon } from '@/utils';
import moment from 'moment-timezone';
import { useMessageBox } from '@/hooks/useMessageBox';
import { ElMessage, FormInstance } from 'element-plus';

const filterValue = ref<Partial<TiktokProductFilterProps>>({});
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const tableData = shallowRef<TiktokProductProps[]>([]);
const loading = shallowRef(false);
const total = shallowRef(0);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getTiktokProductList({
      page: currentPage.value,
      page_size: pageSize.value,
      ...filterValue.value
    });
    tableData.value = (data?.list || []).map((item) => {
      return {
        ...item,
        productImageUrl: tiktokImageUrl(item.product_image[0]),
        updated_at: moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss'),
        created_at: moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
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

// 修改库存
const inventoryVisible = shallowRef(false);
const updateInfo = ref<UpdateInventoryDto>({
  stock: 0,
  warehouses_id: '',
  product_id: '',
  sku_id: '',
  shop_id: ''
});
const formRef = ref<FormInstance | null>(null);
const openInventoryDialog = (row: TiktokProductProps) => {
  updateInfo.value = {
    stock: row.stock,
    warehouses_id: row.warehouses_id,
    product_id: row.product_id,
    sku_id: row.sku_id,
    shop_id: row.shop_id
  };
  inventoryVisible.value = true;
};
const updateInventoryFun = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return;
    useMessageBox('确认修改库存？', async () => {
      try {
        await updateInventory(updateInfo.value);
        ElMessage.success('修改成功');
        inventoryVisible.value = false;
        getListFun();
      } catch (err) {
        console.log(err);
        ElMessage.error('修改失败');
      }
    });
  });
};
const dialogClosed = () => {
  formRef.value?.resetFields();
};
</script>
<style lang="scss" scoped>
.container {
  & .asinBox {
    font-size: 12px;
  }
  & .warehouses_id {
    color: #999;
  }
  & .stockInputNumber {
    width: 100%;
    &:deep(input) {
      text-align: left;
    }
  }
}
</style>
