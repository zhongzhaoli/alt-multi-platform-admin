<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      />
    </div>
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        v-loading="loading"
        :table-columns="config.tableColumns"
        :handle="{
          columns: config.handleColumns
        }"
        :table="{
          data: tableData,
          border: true
        }"
        :pagination="{
          total
        }"
        @handle-click="handleClick"
        @page-change="getListFun"
        @table-refresh="getListFun"
      >
        <template #table-pause="{ row }">
          <SwitchHandle
            v-model="row.pause"
            status-key="pause"
            :inactive-value="0"
            :active-value="1"
            p-id="id"
            :extra-data="row"
            :api="editPauseStore"
          />
        </template>
        <template #table-client_id="{ row }">
          <div class="textBox">
            <RenderCopyIcon title="Client" :text="row.client_id" margin="r" />
            <TextEllipsis :text="row.client_id" />
          </div>
        </template>
        <template #table-client_secret="{ row }">
          <div class="textBox">
            <RenderCopyIcon title="Client Secret" :text="row.client_secret" margin="r" />
            <TextEllipsis :text="row.client_secret" />
          </div>
        </template>
        <template #table-available="{ row }">
          <div v-permission="{ value: 'system:walmartStore:avaliable', type: 'some' }">
            <el-radio-group
              v-model="row.available"
              v-loading="row.loading"
              size="small"
              @change="changeAvailable(row)"
            >
              <el-radio-button label="存活" :value="1" />
              <el-radio-button label="死亡" :value="0" />
            </el-radio-group>
          </div>
          <div v-permission="{ value: 'system:walmartStore:avaliable', type: 'noSome' }">
            <el-tag v-if="row.available" type="success" disable-transitions>存活</el-tag>
            <el-tag v-else type="danger" disable-transitions>死亡</el-tag>
          </div>
        </template>
        <template #table-handle="{ row }">
          <el-button type="primary" link @click="editDialog(row)"> 编辑 </el-button>
        </template>
      </TsxElementTable>
    </div>
    <ConfirmDialog
      v-model="dialogVisible"
      width="500px"
      top="40px"
      class="editDialog"
      :title="dialogTitle"
      @closed="dialogClosed"
      @submit="submitFun"
    >
      <el-form ref="editFormRef" :rules="rules" :model="editFormValues" label-position="top">
        <el-form-item prop="shop_id" label="店铺前台ID：">
          <el-input
            v-model="editFormValues.shop_id"
            :disabled="editFormValues.hasOwnProperty('id')"
            placeholder="请输入店铺ID"
          />
        </el-form-item>
        <el-form-item prop="shop_name" label="店铺名称：">
          <el-input v-model="editFormValues.shop_name" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item prop="brand" label="品牌：">
          <el-input v-model="editFormValues.brand" placeholder="请输入品牌" />
        </el-form-item>
        <el-form-item prop="client_id" label="Client：">
          <el-input v-model="editFormValues.client_id" placeholder="请输入 Client" />
        </el-form-item>
        <el-form-item prop="client_secret" label="Client Secret：">
          <el-input
            v-model="editFormValues.client_secret"
            class="clientSecretInput"
            type="textarea"
            :rows="3"
            placeholder="请输入 Client Secret"
          />
        </el-form-item>
        <el-form-item prop="max_limit" label="上架最大限制数量：">
          <div class="inputNumberBox">
            <el-input-number
              v-model="editFormValues.max_limit"
              style="width: 100%"
              :controls="false"
              placeholder="请输入上架最大限制数量"
            />
          </div>
        </el-form-item>
        <el-form-item prop="daily_limit" label="每日上架限制数量：">
          <div class="inputNumberBox">
            <el-input-number
              v-model="editFormValues.daily_limit"
              style="width: 100%"
              :controls="false"
              placeholder="请输入每日上架限制数量"
            />
          </div>
        </el-form-item>
        <el-form-item prop="listing_min_price" required label="价格区间：">
          <div class="inputNumberBox d-flex align-center">
            <el-input-number
              v-model="editFormValues.listing_min_price"
              style="width: 100%"
              :precision="0"
              :min="1"
              :controls="false"
              placeholder="最小值"
            />
            <div class="interval">~</div>
            <el-input-number
              v-model="editFormValues.listing_max_price"
              style="width: 100%"
              :precision="0"
              :min="1"
              :controls="false"
              placeholder="最大值"
            />
          </div>
        </el-form-item>
      </el-form>
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import * as config from './config';
import { ref, shallowRef } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { ElMessage, FormInstance } from 'element-plus';
import SwitchHandle from '@/components/SwitchHandle/index.vue';
import FilterContainer from '@/components/FilterContainer/index.vue';
import { RenderCopyIcon } from '@/utils';
import moment from 'moment-timezone';
import {
  type StoreProps,
  getStoreList,
  createStore,
  editStore,
  CreateStoreDto,
  editPauseStore,
  EditStoreDto
} from '@/api/system/walmartStore';
import { cloneDeep } from 'lodash-es';
import { useMessageBox } from '@/hooks/useMessageBox';

// 店铺列表
const filterValue = ref<Partial<config.FilterDto>>({});
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const loading = shallowRef(false);
const tableData = shallowRef<StoreProps[]>([]);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getStoreList({
      page: currentPage.value,
      page_size: pageSize.value,
      ...filterValue.value
    });
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      loading: false,
      created_at: moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
    }));
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
getListFun();

// 新增和编辑店铺
const validatorPrice = (_rule: any, _value: any, callback: any) => {
  if (editFormValues.value.listing_min_price && editFormValues.value.listing_max_price) {
    if (editFormValues.value.listing_min_price > editFormValues.value.listing_max_price) {
      callback(new Error('最小值不能大于最大值'));
    } else if (editFormValues.value.listing_min_price === editFormValues.value.listing_max_price) {
      callback(new Error('最小值不能等于最大值'));
    } else {
      callback();
    }
  } else {
    callback(new Error('请输入价格区间'));
  }
};
const rules = {
  ...config.editFormRules,
  listing_min_price: [{ validator: validatorPrice, trigger: 'blur' }]
};
const editFormRef = shallowRef<FormInstance>();
const dialogTitle = shallowRef('新增店铺');
const dialogVisible = shallowRef(false);
const editFormValues = ref<Partial<StoreProps>>({});
const editDialog = (row: StoreProps) => {
  editFormValues.value = cloneDeep(row);
  dialogTitle.value = '编辑店铺';
  dialogVisible.value = true;
};
const handleClick = (key: string) => {
  if (key === 'create') {
    dialogTitle.value = '新增店铺';
    dialogVisible.value = true;
  }
};
const dialogClosed = () => {
  editFormValues.value = {};
  editFormRef.value?.resetFields();
};

const changeAvailable = async (row: StoreProps) => {
  row.loading = true;
  try {
    await editStore(row as EditStoreDto);
    ElMessage.success('编辑成功');
  } catch (err) {
    console.log(err);
  } finally {
    row.loading = false;
  }
};

const submitFun = () => {
  editFormRef.value?.validate(async (valid) => {
    if (!valid) {
      return;
    }
    useMessageBox('确认提交？', async () => {
      try {
        const params: any = {
          shop_id: editFormValues.value.shop_id,
          shop_name: editFormValues.value.shop_name,
          client_id: editFormValues.value.client_id,
          client_secret: editFormValues.value.client_secret,
          max_limit: editFormValues.value.max_limit,
          daily_limit: editFormValues.value.daily_limit,
          brand: editFormValues.value.brand,
          listing_min_price: editFormValues.value.listing_min_price,
          listing_max_price: editFormValues.value.listing_max_price
        };
        if (editFormValues.value.hasOwnProperty('id')) {
          // 编辑
          params.id = editFormValues.value.id;
          params.pause = editFormValues.value.pause;
          params.available = editFormValues.value.available;
          await editStore(params as EditStoreDto);
          ElMessage.success('编辑成功');
        } else {
          // 新增
          await createStore(params as CreateStoreDto);
          ElMessage.success('新增成功');
        }
        dialogVisible.value = false;
        getListFun();
      } catch (err) {
        console.log(err);
      }
    });
  });
};
</script>
<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;
.container {
  & > .tableBox {
    & .textBox {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      & > .copyIcon {
        display: inline-block;
        margin-right: 5px;
        cursor: pointer;
        transition: color 0.2s;
        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
  }

  & .clientSecretInput {
    word-break: break-all;
  }
  & .inputNumberBox {
    width: 100%;
    &:deep(input) {
      text-align: left;
    }
    & > .interval {
      width: 100px;
      text-align: center;
    }
  }
}
</style>
<style lang="scss"></style>
