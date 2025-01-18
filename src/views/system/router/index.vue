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
    <div v-loading="loading" class="tableBox">
      <TsxElementTable
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true,
          rowKey: 'id'
        }"
        :handle="{
          show: true,
          columns: config.handleLeftButtons
        }"
        :pagination="{
          show: false
        }"
        @table-refresh="getListFun"
      >
        <template #table-title="{ row }">
          <i :class="row.meta.icon" />
          <span style="padding-left: 10px">{{ row.meta.title }}</span>
        </template>
        <template #table-hidden="{ row }">
          <el-tag v-if="!row.meta.hidden" disable-transitions type="success"> 是 </el-tag>
          <el-tag v-else disable-transitions type="danger"> 否 </el-tag>
        </template>
      </TsxElementTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
// import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { MenusProps } from './components/Form.vue';
import * as config from './config';
import { ref, shallowReactive, shallowRef } from 'vue';
import * as API_ROUTER from '@/api/system/router';
import { _RouteRecordBase } from 'vue-router';

let tableData = shallowReactive<API_ROUTER.DataProps[]>([]);
// let treeSelectData = shallowReactive<MenusProps[]>([]);
const loading = shallowRef(false);
const filterValue = ref<Partial<config.FilterDto>>({});

const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await API_ROUTER.getRouterList({
      ...filterValue.value
    });
    const handledData = (data || []).map((item) => {
      return {
        ...item,
        hidden: item.meta?.hidden || false,
        breadcrumb_hidden: item.meta?.breadcrumb_hidden || false,
        affix: item.meta?.affix || false,
        keep_alive: item.meta?.keep_alive || false
      };
    });
    tableData = handledData;
    // treeSelectData = generatePidList(handledData);
    generatePidList(handledData);
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

getListFun();

// 生成树目录 选择上级菜单元数据
const generatePidList = (arr: API_ROUTER.DataProps[]): MenusProps[] => {
  const fn = (list: API_ROUTER.DataProps[]) => {
    const result: MenusProps[] = [];
    list.forEach((item) => {
      let newItem: MenusProps;
      if (
        item.meta &&
        item.id &&
        item.meta.title &&
        item.meta.type &&
        item.meta.type !== 'BUTTON'
      ) {
        newItem = {
          label: item.meta.title,
          value: item.id,
          type: item.meta.type,
          children: []
        };
        if (item.children) {
          newItem.children.push(...fn(item.children as API_ROUTER.DataProps[]));
        }
        result.push(newItem);
      }
    });
    return result;
  };
  const children: MenusProps[] = fn(arr);
  return [{ label: '根目录', type: 'ROOT', value: 0, children }];
};
</script>
<style lang="scss" scoped></style>
