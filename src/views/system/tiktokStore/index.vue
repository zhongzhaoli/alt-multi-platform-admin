<template>
  <div class="container">
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        v-loading="loading"
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true,
        }"
        :handle="{
          show: true,
          columns: config.handleColumns,
        }"
        :pagination="{
          total,
        }"
        @handle-click="handleClick"
        @page-change="getListFun"
        @table-refresh="getListFun"
      >
        <template #table-app_key="{ row }">
          <div class="textBox">
            <RenderCopyIcon title="App Key" :text="row.app_key" margin="r" />
            <TextEllipsis :text="row.app_key" />
          </div>
        </template>
        <template #table-app_secret="{ row }">
          <div class="textBox">
            <RenderCopyIcon
              title="App Secret"
              :text="row.app_secret"
              margin="r"
            />
            <TextEllipsis :text="row.app_secret" />
          </div>
        </template>
        <template #table-handle="{ row }">
          <el-button type="primary" link @click="editDialog(row)">
            编辑
          </el-button>
          <el-button type="primary" link @click="delMessageBox(row)">
            删除
          </el-button>
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
            placeholder="请输入店铺ID"
          />
        </el-form-item>
        <el-form-item prop="shop_name" label="店铺名称：">
          <el-input
            v-model="editFormValues.shop_name"
            placeholder="请输入店铺名称"
          />
        </el-form-item>
        <el-form-item prop="client_id" label="App Key：">
          <el-input
            v-model="editFormValues.app_key"
            placeholder="请输入 App Key"
          />
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
import TsxElementTable from "tsx-element-table";
import * as config from "./config";
import { ref } from "vue";
import { PAGE, PAGE_SIZE } from "@/constants/app";
import * as API_TIKTOK from "@/api/system/tiktokStore";
import TextEllipsis from "@/components/TextEllipsis/index.vue";
import { RenderCopyIcon } from "@/utils";
import { useMessageBox } from "@/hooks/useMessageBox";
import { FormInstance } from "element-plus";
import ConfirmDialog from "@/components/ConfirmDialog/index.vue";
import { cloneDeep } from "lodash-es";

const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const total = ref(0);
const loading = ref(false);
const tableData = ref<API_TIKTOK.StoreProps[]>([]);

const getListFun = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const { data } = await API_TIKTOK.getStoreList({
      page: currentPage.value,
      page_size: pageSize.value,
    });
    tableData.value = data?.list || [];
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
// 新增和编辑店铺
const editFormRef = ref<FormInstance>();
const dialogTitle = ref("新增店铺");
const dialogVisible = ref(false);
const submitLoading = ref(false);
const editFormValues = ref<Partial<API_TIKTOK.StoreProps>>({});
const editDialog = (row: API_TIKTOK.StoreProps) => {
  editFormValues.value = cloneDeep(row);
  dialogTitle.value = "编辑店铺";
  dialogVisible.value = true;
};
const dialogClosed = () => {
  editFormValues.value = {};
  editFormRef.value?.resetFields();
};
const handleClick = (key: string) => {
  if (key === "create") {
    dialogTitle.value = "新增店铺";
    dialogVisible.value = true;
  }
};
const submitFun = () => {};
// 删除店铺
const delMessageBox = (row: API_TIKTOK.StoreProps) => {
  console.log(row);
  useMessageBox("确认删除此店铺？", async () => {});
};

getListFun();
</script>
<style lang="scss" scoped>
@use "@/styles/mixins.scss" as *;
.container {
  & > .tableBox {
    margin-top: 0;
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
