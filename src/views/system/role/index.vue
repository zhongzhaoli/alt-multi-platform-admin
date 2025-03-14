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
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true
        }"
        :handle="{
          show: true,
          columns: config.handleLeftButtons
        }"
        :pagination="{
          total
        }"
        @table-refresh="getListFun"
        @page-change="getListFun"
        @handle-click="handleClick"
      >
        <template #table-action="{ row }">
          <el-button link type="primary" @click="editFun(row)"> 编辑 </el-button>
          <el-button link type="primary" @click="editPermissionFun(row)"> 权限 </el-button>
        </template>
      </TsxElementTable>
    </div>
    <ConfirmDialog
      v-model="dialogVisible"
      width="400px"
      :submit-loading="submitLoading"
      :title="dialogCreate ? '新增岗位' : '编辑岗位'"
      @submit="submitValidate"
      @closed="dialogClosed"
    >
      <el-form ref="formRef" label-position="top" :model="formValue" :rules="config.formRules">
        <el-form-item label="岗位名称" prop="role_name">
          <el-input v-model="formValue.role_name" placeholder="请输入岗位名称" />
        </el-form-item>
      </el-form>
    </ConfirmDialog>
    <ConfirmDialog
      v-model="selectPermissionVisible"
      title="设置权限（父子不关联）"
      width="400px"
      :submit-loading="submitLoading"
      @closed="permissionClosed"
      @submit="setPermissionSubmit"
    >
      <div v-loading="permissionLoading" class="permissionBox">
        <el-tree
          ref="perimissionTreeRef"
          node-key="id"
          :data="menuList"
          show-checkbox
          default-expand-all
          check-strictly
          :default-checked-keys="defaultCheckedKeys"
          :props="{ label: (data: any) => data.meta.title }"
        >
          <template #default="{ data }">
            <i v-if="data.meta.type === ROUTE_TYPE_ENUM.BUTTON" class="ri-radio-button-line" />
            <i v-if="data.meta.type === ROUTE_TYPE_ENUM.MENU" class="ri-article-line" />
            <i v-else-if="data.meta.type === ROUTE_TYPE_ENUM.CATA" class="ri-folder-line" />
            <span style="padding-left: 4px">{{ data.meta.title }}</span>
          </template>
        </el-tree>
      </div>
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import * as config from './config';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { ROUTE_TYPE_ENUM } from '@/constants/route';
import * as API_ROLE from '@/api/system/role';
import { DataProps, getRouterList } from '@/api/system/router';
import { ElMessage, FormInstance } from 'element-plus';
import moment from 'moment-timezone';

const tableData = shallowRef<API_ROLE.RoleProps[]>([]);
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const loading = shallowRef(false);
const dialogVisible = shallowRef(false);
const dialogCreate = shallowRef(true);
const submitLoading = shallowRef(false);
const formValue = ref<Partial<API_ROLE.EditRoleDto>>({
  role_name: ''
});

const formRef = shallowRef<FormInstance | null>();
const filterValue = ref<Partial<config.FilterDto>>({});

const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await API_ROLE.getRoleList({
      page: currentPage.value,
      page_size: pageSize.value,
      ...filterValue.value
    });
    tableData.value = (data?.list || []).map((item) => {
      return {
        ...item,
        create_time: moment(item.create_time).format('YYYY-MM-DD HH:mm:ss'),
        update_time: moment(item.update_time).format('YYYY-MM-DD HH:mm:ss')
      };
    });
    total.value = data?.total || 0;
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};
getListFun();

const handleClick = (key: string) => {
  if (key === 'create') {
    dialogCreate.value = true;
    dialogVisible.value = true;
  }
};

const editFun = (row: API_ROLE.RoleProps) => {
  formValue.value = { id: row.id, role_name: row.role_name };
  dialogCreate.value = false;
  dialogVisible.value = true;
};

const dialogClosed = () => {
  formValue.value = {};
  formRef.value?.resetFields();
};

const submitValidate = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      dialogCreate.value ? createRoleFun() : editRoleFun();
    }
  });
};

const createRoleFun = async () => {
  submitLoading.value = true;
  try {
    await API_ROLE.createRole(formValue.value as API_ROLE.CreateRoleDto);
    ElMessage.success('操作成功');
    getListFun();
    dialogVisible.value = false;
  } catch (err) {
    console.error(err);
  } finally {
    submitLoading.value = false;
  }
};

const editRoleFun = async () => {
  submitLoading.value = true;
  try {
    await API_ROLE.editRole(formValue.value as API_ROLE.EditRoleDto);
    ElMessage.success('操作成功');
    getListFun();
    dialogVisible.value = false;
  } catch (err) {
    console.error(err);
  } finally {
    submitLoading.value = false;
  }
};

// 设置权限
const selectPermissionVisible = shallowRef(false);
const permissionLoading = shallowRef(false);
const menuList = shallowRef<DataProps[]>([]);
const defaultCheckedKeys = shallowRef<string[]>([]);
const tempRoleId = shallowRef<string>('');
const perimissionTreeRef = shallowRef<{
  getCheckedNodes: () => string[];
  setCheckedKeys: () => void;
} | null>(null);
const editPermissionFun = (row: API_ROLE.RoleProps) => {
  selectPermissionVisible.value = true;
  tempRoleId.value = row.role_id;
  getPermissionList();
};
const getPermissionList = async () => {
  permissionLoading.value = true;
  try {
    const [data1, data2] = await Promise.all([
      getRouterList(),
      API_ROLE.getRoleRouter(tempRoleId.value)
    ]);
    menuList.value = data1.data || [];
    defaultCheckedKeys.value = data2.data || [];
  } catch (err) {
    console.error(err);
  } finally {
    permissionLoading.value = false;
  }
};
const permissionClosed = () => {
  defaultCheckedKeys.value = [];
  tempRoleId.value = '';
};
const setPermissionSubmit = async () => {
  submitLoading.value = true;
  if (!perimissionTreeRef.value) return;
  const checkedNodes = perimissionTreeRef.value.getCheckedNodes();
  try {
    await API_ROLE.setRoleRouter({
      role_id: tempRoleId.value,
      router_ids: checkedNodes.map((item: any) => item.id)
    });
    ElMessage.success('操作成功');
  } catch (err) {
    console.log(err);
  } finally {
    submitLoading.value = false;
    selectPermissionVisible.value = false;
  }
};
</script>
<style lang="scss" scoped>
.container {
  .permissionBox {
    max-height: 300px;
    overflow: auto;
  }
}
</style>
