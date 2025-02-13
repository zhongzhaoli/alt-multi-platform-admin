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
          <div class="d-flex align-center handleLeftBox">
            <el-button type="primary" @click="addTask">新增任务</el-button>
            <div class="poolNum">
              <span class="refresh" @click="getCanuseUpcPool(true)">
                <el-icon size="13"><Refresh /></el-icon>
              </span>
              <span class="num">
                可用UPC池数量：<b>{{ canuseUpcPool || 0 }}</b>
              </span>
            </div>
          </div>
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
          <el-button link type="primary" @click="downloadLog(row.taskId)">下载日志</el-button>
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
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import {
  getUpcTestingList,
  createUpcTesting,
  getcanuseTotal,
  getUpcTestingLogs
} from '@/api/system/upcTesting';
import type { UpcTestingProps } from '@/api/system/upcTesting';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { Loading, Refresh } from '@element-plus/icons-vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import * as config from './config';
import { ref, shallowRef } from 'vue';
import FileUpload, { type FileUploadInstance } from '@/components/FileUpload/index.vue';
import { ElMessage } from 'element-plus';
import { useFullLoading } from '@/hooks/useFullLoading';
import { downloadCore } from '@/utils';

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

// 下载日志
const fullLoading = useFullLoading();
const downloadLog = async (taskId: string) => {
  fullLoading.open();
  try {
    const blob = await getUpcTestingLogs(taskId);
    downloadCore(blob, `UPC检测-${taskId}.txt`);
  } catch (err) {
    console.log(err);
  } finally {
    fullLoading.close();
  }
};

// 获取可用UPC池
const canuseUpcPool = shallowRef(0);
const getCanuseUpcPool = async (refresh = false) => {
  try {
    const { data } = await getcanuseTotal();
    canuseUpcPool.value = data;
    if (refresh) ElMessage.success('刷新成功');
  } catch (err) {
    console.log(err);
  }
};
getCanuseUpcPool();
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
  & .handleLeftBox {
    & > .poolNum {
      margin-left: var(--normal-padding);
      color: #a0a0a0;
      display: inline-flex;
      & > span {
        display: inline-block;
        height: 14px;
        line-height: 14px;
      }
      & > .refresh {
        margin-right: 4px;
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
          color: var(--el-color-primary);
          transform: rotate(90deg);
        }
      }
      & > .num {
        font-size: 13px;
      }
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
