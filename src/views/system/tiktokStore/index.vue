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
        :table="{
          data: tableData,
          border: true
        }"
        :handle="{
          show: true
        }"
        :pagination="{
          total
        }"
        @page-change="getListFun"
        @table-refresh="getListFun"
      >
        <template #handle-left>
          <el-button type="primary" disabled>新增店铺</el-button>
        </template>
        <template #table-app_key="{ row }">
          <div class="textBox">
            <RenderCopyIcon title="App Key" :text="row.app_key" margin="r" />
            <TextEllipsis :text="row.app_key" />
          </div>
        </template>
        <template #table-app_secret="{ row }">
          <div class="textBox">
            <RenderCopyIcon title="App Secret" :text="row.app_secret" margin="r" />
            <TextEllipsis :text="row.app_secret" />
          </div>
        </template>
        <template #table-pause="{ row }">
          <SwitchHandle
            v-model="row.pause"
            status-key="pause"
            :inactive-value="0"
            :active-value="1"
            p-id="id"
            :extra-data="row"
            :api="API_TIKTOK.editPauseStore"
          />
        </template>
        <template #table-available="{ row }">
          <el-tag v-if="row.available" type="success" disable-transitions>存活</el-tag>
          <el-tag v-else type="danger" disable-transitions>死亡</el-tag>
        </template>
        <template #table-handle="{ row }">
          <el-button type="primary" link @click="editDialog(row)"> 编辑 </el-button>
        </template>
      </TsxElementTable>
    </div>
    <ConfirmDialog
      v-model="dialogVisible"
      width="400px"
      :title="dialogTitle"
      :submit-loading="submitLoading"
      @closed="dialogClosed"
      @submit="submitFun"
    >
      <el-form
        ref="editFormRef"
        :rules="config.editFormRules"
        :model="editFormValues"
        label-position="top"
      >
        <el-form-item prop="shop_id" label="店铺ID：">
          <el-input
            v-model="editFormValues.shop_id"
            :disabled="editFormValues.hasOwnProperty('id')"
            placeholder="请输入店铺ID"
          />
        </el-form-item>
        <el-form-item prop="shop_name" label="店铺名称：">
          <el-input v-model="editFormValues.shop_name" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item prop="client_id" label="App Key：">
          <el-input v-model="editFormValues.app_key" placeholder="请输入 App Key" />
        </el-form-item>
        <el-form-item prop="clientSecret" label="App Secret：">
          <el-input
            v-model="editFormValues.app_secret"
            class="clientSecretInput"
            type="textarea"
            :rows="3"
            placeholder="请输入 App Secret"
          />
        </el-form-item>
      </el-form>
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import * as config from './config';
import { ref, shallowRef, unref } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import * as API_TIKTOK from '@/api/system/tiktokStore';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import { RenderCopyIcon } from '@/utils';
import { useMessageBox } from '@/hooks/useMessageBox';
import { FormInstance } from 'element-plus';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { cloneDeep } from 'lodash-es';
import SwitchHandle from '@/components/SwitchHandle/index.vue';
import FilterContainer from '@/components/FilterContainer/index.vue';
import moment from 'moment-timezone';
import { ElMessage } from 'element-plus';

const filterValue = ref<Partial<config.FilterDto>>({});
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const loading = shallowRef(false);
const tableData = shallowRef<API_TIKTOK.StoreProps[]>([]);

const getListFun = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const { data } = await API_TIKTOK.getStoreList({
      page: currentPage.value,
      page_size: pageSize.value,
      ...unref(filterValue)
    });
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      created_at: moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
    }));
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
// 新增和编辑店铺
const editFormRef = shallowRef<FormInstance>();
const dialogTitle = shallowRef('新增店铺');
const dialogVisible = shallowRef(false);
const submitLoading = shallowRef(false);
const editFormValues = ref<Partial<API_TIKTOK.StoreProps>>({});
const editDialog = (row: API_TIKTOK.StoreProps) => {
  editFormValues.value = cloneDeep(row);
  dialogTitle.value = '编辑店铺';
  dialogVisible.value = true;
};
const dialogClosed = () => {
  editFormValues.value = {};
  editFormRef.value?.resetFields();
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
          app_key: editFormValues.value.app_key,
          app_secret: editFormValues.value.app_secret,
          shop_name: editFormValues.value.shop_name
        };
        if (editFormValues.value.hasOwnProperty('id')) {
          // 编辑
          params.id = editFormValues.value.id;
          params.pause = editFormValues.value.pause;
          params.available = editFormValues.value.available;
          await API_TIKTOK.editStore(params as API_TIKTOK.EditStoreDto);
          ElMessage.success('编辑成功');
        } else {
          // 新增
          ElMessage.warning('新增店铺功能暂未开放');
        }
        dialogVisible.value = false;
        getListFun();
      } catch (err) {
        console.log(err);
      }
    });
  });
};

getListFun();
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
}
</style>
