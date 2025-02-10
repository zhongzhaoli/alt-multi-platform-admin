<template>
  <div class="container">
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :handle="{
          show: true
        }"
        :table="{
          data: tableData,
          loading,
          border: true
        }"
        :pagination="{
          total
        }"
        @page-change="getListFun"
        @table-refresh="getListFun"
      >
        <template #handle-left>
          <el-button type="primary" @click="addTask">新增任务</el-button>
        </template>
        <template #table-status="{ row }">
          <el-tag :type="row.statusTag.type" disable-transitions>
            <div class="d-inline-flex align-center">
              <template v-if="row.status === 'RUNNING'">
                <el-icon size="12" class="is-loading">
                  <Loading />
                </el-icon>
              </template>
              {{ row.statusTag.text || '' }}
            </div>
          </el-tag>
        </template>
        <template #table-action="{ row }">
          <el-button link type="primary" @click="openLogs(row.taskId)">日志</el-button>
        </template>
      </TsxElementTable>
    </div>
    <ConfirmDialog
      v-model="dialogVisible"
      width="500px"
      title="上传文件"
      :submit-loading="submitLoading"
      @submit="uploadSubmit"
    >
      <div class="dialogPsBox">
        <div class="title">注意事项：</div>
        <div class="desc"> 1、请直接上传魔词商学院导出的Excel文件。 </div>
        <div class="desc"> 2、请确保上传的文件格式正确，否则会导致上传失败。 </div>
      </div>
      <FileUpload ref="fileUploadRef" accept=".xlsx" :multiple="true" />
    </ConfirmDialog>
    <ConfirmDialog
      v-model="logDialogVisible"
      width="800px"
      title="日志"
      :show-confirm-btn="false"
      cancel-btn-text="关闭"
    >
      <div class="logDiv">
        <el-scrollbar wrap-class="logDiv" style="height: 100%">
          <div v-for="(log, index) in logsList" :key="index">{{ log }}</div>
        </el-scrollbar>
      </div>
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import { getUpcTestingList, createUpcTesting, getUpcTestingLogs } from '@/api/system/upcTesting';
import type { UpcTestingProps } from '@/api/system/upcTesting';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { Loading } from '@element-plus/icons-vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import * as config from './config';
import { ref, shallowRef } from 'vue';
import FileUpload, { type FileUploadInstance } from '@/components/FileUpload/index.vue';
import { ElMessage } from 'element-plus';

// 任务列表
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const tableData = ref<UpcTestingProps[]>([]);
const loading = shallowRef(false);
const getListFun = async () => {
  try {
    loading.value = true;
    const { data } = await getUpcTestingList({
      page: currentPage.value,
      page_size: pageSize.value
    });
    tableData.value = (data?.list || []).map((item) => {
      return {
        ...item,
        statusTag: config.statusMap[item.status]
      };
    });
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

// 新增任务
const fileUploadRef = ref<FileUploadInstance | null>(null);
const dialogVisible = shallowRef(false);
const submitLoading = shallowRef(false);
const addTask = () => {
  dialogVisible.value = true;
};
const uploadSubmit = async () => {
  if (fileUploadRef.value) {
    const fileList = fileUploadRef.value.getFileList();
    if (!fileList.length) {
      return ElMessage.error('请选择文件');
    }
    try {
      submitLoading.value = true;
      const formData = new FormData();
      fileList.forEach((file) => {
        file.status = 'uploading';
        if (file.raw) {
          formData.append('file', file.raw);
        }
      });
      await createUpcTesting(formData);
      dialogVisible.value = false;
      fileUploadRef.value.clean();
      ElMessage.success('操作成功');
      getListFun();
    } catch (err) {
      console.log(err);
      fileList.forEach((file) => {
        file.status = 'fail';
      });
    } finally {
      submitLoading.value = false;
    }
  }
};

// 日志
const logDialogVisible = shallowRef(false);
const logLoading = shallowRef(false);
const logsList = ref<string[]>([]);
const openLogs = async (taskId: string) => {
  logDialogVisible.value = true;
  logLoading.value = true;
  logsList.value = [];
  try {
    const { data } = await getUpcTestingLogs(taskId);
    logsList.value = (data || []).reverse().filter((item) => item);
  } catch (err) {
    console.log(err);
  } finally {
    logLoading.value = false;
  }
};

getListFun();
</script>
<style lang="scss" scoped>
.container {
  & > .tableBox {
    margin-top: 0;
    & .is-loading {
      margin-right: 4px;
    }
    &:deep(.el-tag__content) {
      display: flex;
    }
  }
  & .logDiv {
    height: 400px;
    background-color: #eaeaea;
    border-radius: 4px;
    font-size: 13px;
    color: #555555;
    line-height: 24px;
    padding: var(--normal-padding);
  }
}
</style>
