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
          show: false,
        }"
        :pagination="{
          total,
        }"
        @page-change="getListFun"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from "tsx-element-table";
import * as config from "./config";
import { ref } from "vue";
import { PAGE, PAGE_SIZE } from "@/constants/app";
import * as API_TIKTOK from "@/api/system/tiktokStore";

const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const total = ref(0);
const loading = ref(false);
const tableData = ref<API_TIKTOK.StoreProps[]>([]);

const getListFun = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const { datas } = await API_TIKTOK.getStoreList({
      page: currentPage.value,
      pageSize: pageSize.value,
    });
    tableData.value = datas?.data || [];
    total.value = datas?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

getListFun();
</script>
<style lang="scss" scoped>
@use "@/styles/mixins.scss" as *;
.container {
  & > .tableBox {
    margin-top: 0;
    & .textBox {
      display: flex;
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
      & > .copyText {
        display: inline-block;
        max-width: 100%;
        text-align: left;
        word-break: break-all;
        @include text-ellipsis(1);
      }
    }
  }
  & .clientSecretInput {
    word-break: break-all;
  }
}
</style>
