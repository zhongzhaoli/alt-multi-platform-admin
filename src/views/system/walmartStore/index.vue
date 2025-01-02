<template>
  <div class="container">
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        v-loading="loading"
        :table-columns="config.tableColumns"
        :handle="{
          columns: config.handleColumns,
        }"
        :table="{
          data: tableData,
          border: true,
        }"
        :pagination="{
          total,
        }"
        @handle-click="handleClick"
        @page-change="getListFun"
        @table-refresh="getListFun"
      >
        <template #table-client_id="{ row }">
          <div class="textBox">
            <RenderCopyIcon title="Client" :text="row.client_id" margin="r" />
            <TextEllipsis :text="row.client_id" />
          </div>
        </template>
        <template #table-client_secret="{ row }">
          <div class="textBox">
            <RenderCopyIcon
              title="Client Secret"
              :text="row.client_secret"
              margin="r"
            />
            <TextEllipsis :text="row.client_secret" />
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
        <el-form-item prop="shop_id" label="店铺前台ID：">
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
        <el-form-item prop="client_id" label="Client：">
          <el-input
            v-model="editFormValues.client_id"
            placeholder="请输入 Client"
          />
        </el-form-item>
        <el-form-item prop="clientSecret" label="Client Secret：">
          <el-input
            v-model="editFormValues.client_secret"
            class="clientSecretInput"
            type="textarea"
            :rows="3"
            placeholder="请输入 Client Secret"
          />
        </el-form-item>
      </el-form>
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from "tsx-element-table";
import ConfirmDialog from "@/components/ConfirmDialog/index.vue";
import TextEllipsis from "@/components/TextEllipsis/index.vue";
import * as config from "./config";
import { ref } from "vue";
import { PAGE, PAGE_SIZE } from "@/constants/app";
import { ElMessage, FormInstance } from "element-plus";
import { RenderCopyIcon } from "@/utils";
import {
  type StoreProps,
  getStoreList,
  deleteStore,
  createStore,
  editStore,
  CreateStoreDto,
  EditStoreDto,
} from "@/api/system/walmartStore";
import { useMessageBox } from "@/hooks/useMessageBox";
import { cloneDeep } from "lodash-es";

// 店铺列表
const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const total = ref(0);
const loading = ref(false);
const tableData = ref<StoreProps[]>([]);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getStoreList({
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
getListFun();

// 新增和编辑店铺
const editFormRef = ref<FormInstance>();
const dialogTitle = ref("新增店铺");
const dialogVisible = ref(false);
const submitLoading = ref(false);
const editFormValues = ref<Partial<StoreProps>>({});
const editDialog = (row: StoreProps) => {
  editFormValues.value = cloneDeep(row);
  dialogTitle.value = "编辑店铺";
  dialogVisible.value = true;
};
const handleClick = (key: string) => {
  if (key === "create") {
    dialogTitle.value = "新增店铺";
    dialogVisible.value = true;
  }
};
const dialogClosed = () => {
  editFormValues.value = {};
  editFormRef.value?.resetFields();
};
const submitFun = () => {
  submitLoading.value = true;
  editFormRef.value?.validate(async (valid) => {
    if (!valid) {
      submitLoading.value = false;
      return;
    }
    try {
      const params: any = {
        shop_id: editFormValues.value.shop_id,
        shop_name: editFormValues.value.shop_name,
        client_id: editFormValues.value.client_id,
        client_secret: editFormValues.value.client_secret,
      };
      if (editFormValues.value.hasOwnProperty("id")) {
        // 编辑
        params.id = editFormValues.value.id;
        await editStore(params as EditStoreDto);
        ElMessage.success("编辑成功");
      } else {
        // 新增
        await createStore(params as CreateStoreDto);
        ElMessage.success("新增成功");
      }
      dialogVisible.value = false;
      getListFun();
    } catch (err) {
      console.log(err);
    } finally {
      submitLoading.value = false;
    }
  });
};

// 删除店铺
const delMessageBox = (row: StoreProps) => {
  useMessageBox("确认删除此店铺？", async () => {
    try {
      await deleteStore(row);
      ElMessage.success("删除成功");
      getListFun();
    } catch (err) {
      console.log(err);
    }
  });
};
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
  & .clientSecretInput {
    word-break: break-all;
  }
}
</style>
