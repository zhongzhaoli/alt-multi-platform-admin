<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      />
    </div>
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :table-columns="tableColumns"
        :table="{
          border: true,
          data: tableData,
          loading,
        }"
        :pagination="{
          total,
        }"
        @table-refresh="getListFun"
        @page-change="getListFun"
      >
        <template #table-operation_status="{ row }">
          <el-tag
            v-if="row.operation_status === 1"
            type="success"
            disable-transitions
          >
            成功
          </el-tag>
          <el-tag v-else type="danger" disable-transitions>失败</el-tag>
        </template>
        <template #table-action="{ row }">
          <el-button link type="primary" @click="viewDetailFun(row)">
            查看详情
          </el-button>
        </template>
      </TsxElementTable>
    </div>
    <el-drawer v-model="detailVisible" title="日志详情">
      <el-form v-if="tempDetail" label-position="top">
        <el-form-item label="请求路径：">
          {{ tempDetail.request_path || "-" }}
        </el-form-item>
        <el-form-item label="请求方式：">
          {{ tempDetail.request_method || "-" }}
        </el-form-item>
        <el-form-item label="请求描述：">
          {{ tempDetail.operation_name || "-" }}
        </el-form-item>
        <el-form-item label="请求用户：">
          {{ tempDetail.user_name || "-" }}
        </el-form-item>
        <el-form-item label="请求IP：">
          {{ tempDetail.ip || "-" }}
        </el-form-item>
        <el-form-item label="响应code：">
          {{ tempDetail.response_code || "-" }}
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from "@/components/FilterContainer/index.vue";
import TsxElementTable from "tsx-element-table";
import { filterColumns, tableColumns } from "./config";
import * as API_LOG from "@/api/handleLogs/index";
import { ref, unref } from "vue";
import { PAGE, PAGE_SIZE } from "@/constants/app";

// 日志列表
const filterValue = ref<object>({});
const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const total = ref(0);
const tableData = ref<any[]>([]);
const loading = ref(false);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await API_LOG.getLogList({
      page: unref(currentPage),
      page_size: unref(pageSize),
      ...unref(filterValue),
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

// 查看详情
const detailVisible = ref(false);
const tempDetail = ref<API_LOG.LogProps | null>(null);
const viewDetailFun = (row: API_LOG.LogProps) => {
  tempDetail.value = row;
  detailVisible.value = true;
};
</script>
<style lang="scss" scoped></style>
