<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      >
        <template #shop_id="{ form, row, change }">
          <SelectWalmartStore v-model="form[row.prop]" multiple @change="change" />
        </template>
      </FilterContainer>
    </div>
    <div class="tableBox">
      <TsxElementTable
        ref="tableRef"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true,
          rowKey: (row: WalmartProductProps) => row.shop_id + row.sku + row.asin,
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
        @selection-change="selectionChange"
      >
        <template #handle-left>
          <div class="d-flex align-center">
            <el-button
              type="primary"
              :disabled="!selectionList.length"
              @click="retireItemFun(selectionList)"
            >
              批量下架
            </el-button>
            <div class="frequencyText">更新频率：每 6 个小时</div>
          </div>
        </template>
        <template #table-shop_name="{ row }">
          <TextEllipsis :text="row.shop_name" :line="1" />
          <el-button v-if="row.is_deleted === 0" link type="danger">(死亡)</el-button>
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
            :product-name="row.new_title || row.title"
            :desc-list="[
              {
                text: row.item_id,
                prefix: 'ID'
              },
              {
                text: row.sku,
                prefix: 'SKU'
              }
            ]"
          />
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
        <template #table-asin="{ row }">
          <TextEllipsis :text="row.asin" :line="1" />
          <TextEllipsis :text="row.pasin" :line="1" bold />
        </template>
        <template #table-action="{ row }">
          <el-button link type="primary" @click="openInventoryDialog(row)">修改库存</el-button>
          <el-button link type="primary" @click="retireItemFun([row])">下架</el-button>
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
import TsxElementTable, { ComponentInstance } from 'tsx-element-table';
import SelectWalmartStore from '@/components/SelectWalmartStore/index.vue';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import * as config from './config';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { ref, shallowRef } from 'vue';
import {
  getWalmartProductList,
  type WalmartProductFilterProps,
  type WalmartProductProps,
  retireProduct,
  UpdateInventoryDto,
  updateInventory
} from '@/api/product/walmart';
import ProductItem from '@/components/ProductItem/index.vue';
import { RenderCopyIcon } from '@/utils';
import moment from 'moment-timezone';
import { useMessageBox } from '@/hooks/useMessageBox';
import { ElMessage, FormInstance } from 'element-plus';

defineOptions({
  name: 'ProductWalmart'
});

const filterValue = ref<Partial<WalmartProductFilterProps>>({});
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const tableData = ref<WalmartProductProps[]>([]);
const loading = shallowRef(false);
const total = shallowRef(0);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getWalmartProductList({
      page: currentPage.value,
      page_size: pageSize.value,
      ...filterValue.value
    });
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      productImageUrl: item.image_url && item.image_url.length ? item.image_url[0] : '',
      updated_at: moment(item.updated_at).format('YYYY-MM-DD HH:mm:ss'),
      created_at: moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
    }));
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

// 下架
const selectionList = ref<WalmartProductProps[]>([]);
const tableRef = ref<ComponentInstance | null>(null);
const selectionChange = (rows: WalmartProductProps[]) => {
  selectionList.value = rows;
};
const retireItemFun = async (rows: WalmartProductProps[]) => {
  if (!rows.length) return ElMessage.warning('请选择商品');
  if (rows.length > 20) return ElMessage.warning('最多选择20个商品');
  useMessageBox('确认下架该商品？', async () => {
    try {
      await retireProduct({
        products: rows.map((v) => {
          return {
            shop_id: v.shop_id,
            sku: v.sku,
            asin: v.asin
          };
        })
      });
      ElMessage.success('下架成功');
      tableRef.value?.getTableRef().clearSelection();
      getListFun();
    } catch (err) {
      console.log(err);
    }
  });
};

// 修改库存
const inventoryVisible = shallowRef(false);
const updateInfo = ref<UpdateInventoryDto>({
  stock: 0,
  sku: '',
  shop_id: ''
});
const formRef = ref<FormInstance | null>(null);
const openInventoryDialog = (row: WalmartProductProps) => {
  updateInfo.value = {
    stock: row.stock,
    sku: row.sku,
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

getListFun();
</script>
<style lang="scss" scoped>
.container {
  & .frequencyText {
    margin-left: var(--normal-padding);
  }
  & .stockInputNumber {
    width: 100%;
    &:deep(input) {
      text-align: left;
    }
  }
}
</style>
