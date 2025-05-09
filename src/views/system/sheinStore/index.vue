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
        <template #table-shein_cookie="{ row }">
          <div class="textBox">
            <RenderCopyIcon title="Shein Cookie" :text="row.shein_cookie" margin="r" />
            <TextEllipsis :text="row.shein_cookie" :line="1" />
          </div>
        </template>
        <template #table-shop_status="{ row }">
          <el-tag v-if="row.status" type="success" disable-transitions>存活</el-tag>
          <el-tag v-else type="danger" disable-transitions>死亡</el-tag>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import * as config from './config';
import { ref, shallowRef, unref } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import * as API_SHEIN from '@/api/system/sheinStore';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import { RenderCopyIcon } from '@/utils';
import FilterContainer from '@/components/FilterContainer/index.vue';

const filterValue = ref<Partial<config.FilterDto>>({});
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const loading = shallowRef(false);
const tableData = shallowRef<API_SHEIN.StoreProps[]>([]);

const getListFun = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const { data } = await API_SHEIN.getStoreList({
      page: currentPage.value,
      page_size: pageSize.value,
      ...unref(filterValue)
    });
    tableData.value = (data?.list || []).map((item) => ({
      ...item
    }));
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
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
  &:deep(.el-drawer__body) {
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  &:deep(.el-drawer__header) {
    display: none;
  }
  & .scoreBox {
    position: relative;
    background: linear-gradient(to bottom, #fff3df, #ffffff);
    padding: 20px;
    flex: 0 0 auto;
    & > .scoreTitle {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > .avaliable {
        display: flex;
        align-items: center;
        color: red;
        & > span {
          padding-left: 6px;
        }
      }
    }
    & > .currentScore {
      width: 100%;
      position: relative;
      height: 30px;
      & > div {
        width: 30px;
        font-size: 13px;
        line-height: 16px;
        height: 100%;
        text-align: center;
        position: absolute;
        font-weight: bold;
        & > i {
          font-size: 20px;
          position: relative;
          top: -2px;
        }
      }
    }
    & > .scoreProgress {
      position: relative;
      & > .scale {
        width: 1px;
        background-color: #fff;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 999;
        &:first-child {
          left: calc(5% - 0.5px);
        }
        &:nth-child(2) {
          left: calc(10% - 0.5px);
        }
        &:nth-child(2) {
          left: calc(10% - 0.5px);
        }
        &:nth-child(3) {
          left: calc(15% - 0.5px);
        }
        &:nth-child(4) {
          left: calc(20% - 0.5px);
        }
      }
      &:deep(.el-progress-bar__inner) {
        border-radius: 2px;
      }
      &:deep(.el-progress-bar__outer) {
        background-color: #efefef;
      }
    }
    & > .scoreScaleTextBox {
      position: relative;
      margin-top: 4px;
      height: 20px;
      & > div {
        position: absolute;
        width: 24px;
        height: 20px;
        line-height: 20px;
        color: #666;
        font-size: 12px;
        text-align: center;
      }
      & > div:nth-child(1) {
        left: 0;
        text-align: left;
      }
      & > div:nth-child(2) {
        left: calc(5% - 12px);
      }
      & > div:nth-child(3) {
        left: calc(10% - 12px);
      }
      & > div:nth-child(4) {
        left: calc(15% - 12px);
      }
      & > div:nth-child(5) {
        left: calc(20% - 12px);
      }
      & > div:last-child {
        width: fit-content;
        right: 0;
      }
    }
    & > .assembleBox {
      font-size: 12px;
      display: flex;
      color: #666;
      justify-content: space-between;
    }
  }
  & .otherMessageBox {
    padding: 0 20px 20px 20px;
    height: calc(100vh - 155px);
    &.pt {
      padding-top: 20px;
    }
    & > .tabsBox {
      height: 100%;
      &:deep(.el-tab-pane) {
        height: 100%;
      }
    }
    & .tableBox {
      height: calc(100% - 32px - 20px);
      margin-bottom: 20px;
      & .copyText {
        color: #c6c6c6;
        font-size: 12px;
        width: 100%;
      }
      & .appealStatus {
        color: #c6c6c6;
        font-size: 13px;
        margin-top: 4px;
      }
    }
    & .paginationBox {
      height: 32px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
