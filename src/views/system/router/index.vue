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
        @handle-click="handleClick"
      >
        <template #table-title="{ row }">
          <i :class="row.meta.icon" />
          <span style="padding-left: 10px">{{ row.meta.title }}</span>
        </template>
        <template #table-hidden="{ row }">
          <el-tag v-if="!row.meta.hidden" disable-transitions type="success"> 是 </el-tag>
          <el-tag v-else disable-transitions type="danger"> 否 </el-tag>
        </template>
        <template #table-action="{ row }">
          <el-button type="primary" link @click="addToParent(row)"> 新增 </el-button>
          <el-button type="primary" link @click="editFun(row)"> 编辑 </el-button>
        </template>
      </TsxElementTable>
    </div>
    <ConfirmDialog
      v-model="editVisible"
      :title="dialogType === 'create' ? '新增菜单' : '编辑菜单'"
      :submit-loading="submitLoading"
      width="600px"
      @submit="editSubmitFun"
    >
      <EditForm
        ref="editFormRef"
        :edit-type="dialogType"
        :default-value="editFormValue"
        :menus="treeSelectData"
      />
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import EditForm, { EditFormInstance, MenusProps } from './components/Form.vue';
import * as config from './config';
import { ref } from 'vue';
import * as API_ROUTER from '@/api/system/router';
import { _RouteRecordBase } from 'vue-router';
import { cloneDeep } from 'lodash-es';
import { ElMessage } from 'element-plus';

const tableData = ref<API_ROUTER.DataProps[]>([]);
const treeSelectData = ref<MenusProps[]>([]);
const loading = ref(false);
const filterValue = ref<Partial<config.FilterDto>>();

const getListFun = async () => {
  loading.value = true;
  try {
    const { datas } = await API_ROUTER.getRouterList({
      ...filterValue.value
    });
    const handledData = (datas || []).map((item) => {
      return {
        ...item,
        hidden: item.meta?.hidden || false,
        breadcrumb_hidden: item.meta?.breadcrumb_hidden || false,
        affix: item.meta?.affix || false,
        keep_alive: item.meta?.keep_alive || false
      };
    });
    tableData.value = handledData;
    treeSelectData.value = generatePidList(handledData);
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

const editFormValue = ref<any>({});
const editVisible = ref(false);
const submitLoading = ref(false);
const editFormRef = ref<EditFormInstance | null>(null);
const dialogType = ref<'create' | 'edit'>('create');
const editFun = (row: API_ROUTER.DataProps) => {
  editFormValue.value = cloneDeep(row);
  dialogType.value = 'edit';
  editVisible.value = true;
};
const editSubmitFun = async () => {
  if (!editFormRef.value) return;
  const data = editFormRef.value.getFormValue();
  submitLoading.value = true;
  try {
    if (dialogType.value === 'edit') {
      await API_ROUTER.updateRouter(data as API_ROUTER.UpdateRouterDto);
      ElMessage.success('编辑成功');
    } else {
      await API_ROUTER.createRouter(data as API_ROUTER.CreateRouterDto);
      ElMessage.success('创建成功');
    }
    editVisible.value = false;
    getListFun();
  } catch (err) {
    console.log(err);
  } finally {
    submitLoading.value = false;
  }
};
const handleClick = () => {
  editFormValue.value = {
    ...config.initFormValue
  };
  dialogType.value = 'create';
  editVisible.value = true;
};
const addToParent = (row: API_ROUTER.DataProps) => {
  editFormValue.value = {
    ...config.initFormValue,
    pid: row.id
  };
  dialogType.value = 'create';
  editVisible.value = true;
};
</script>
<style lang="scss" scoped></style>
