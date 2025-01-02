<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      >
        <!-- <template #user_id="{ row, form }">
          <SearchUser
            v-model="form[row.prop]"
            filterable
            clearable
            @change="getListFun"
          />
        </template> -->
      </FilterContainer>
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
        <template #table-response_code="{ row }">
          <el-tag
            v-if="row.resp_code === ResponseCode.SUCCESS"
            type="success"
            disable-transitions
          >
            成功
          </el-tag>
          <el-tag v-else type="danger">失败</el-tag>
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
          {{ tempDetail.req_path || "-" }}
        </el-form-item>
        <el-form-item label="请求方式：">
          {{ tempDetail.req_method || "-" }}
        </el-form-item>
        <el-form-item label="请求描述：">
          {{ tempDetail.req_content || "-" }}
        </el-form-item>
        <el-form-item label="请求分类：">
          {{ tempDetail.router_tags || "-" }}
        </el-form-item>
        <el-form-item label="请求用户：">
          {{ tempDetail.user_name || "-" }}
        </el-form-item>
        <el-form-item label="请求IP：">
          {{ tempDetail.user_ip || "-" }}
        </el-form-item>
        <el-form-item label="响应code：">
          {{ tempDetail.resp_code || "-" }}
        </el-form-item>
      </el-form>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import FilterContainer from "@/components/FilterContainer/index.vue";
import TsxElementTable from "tsx-element-table";
import { filterColumns, tableColumns } from "./config";
// import SearchUser from '@/components/SelectUser/index.vue';
import * as API_LOG from "@/api/handleLogs/index";
import { ref, unref } from "vue";
import { PAGE, PAGE_SIZE } from "@/constants/app";
import { ResponseCode } from "@/config/request";

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
