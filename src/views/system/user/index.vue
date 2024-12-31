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
    <div v-loading="loading" class="tableBox">
      <TsxElementTable
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :table-columns="tableColumns"
        :table="{
          data: tableData,
          border: true,
        }"
        :handle="{
          columns: handleLeftButtons,
        }"
        :pagination="{
          total,
        }"
        @page-change="getListFun"
        @table-refresh="getListFun"
        @handle-click="handleClick"
      >
        <template #table-action="{ row }">
          <el-button link type="primary" @click="editFun(row)">
            编辑
          </el-button>
          <el-button link type="primary" @click="editPasswordFun(row)">
            重置密码
          </el-button>
          <el-button link type="primary" @click="deleteUser(row)">
            删除
          </el-button>
        </template>
      </TsxElementTable>
    </div>
    <ConfirmDialog
      v-model="dialogVisible"
      width="500px"
      title="新增用户"
      :submit-loading="submitLoading"
      @submit="createUserValidate"
    >
      <el-form
        ref="createUserFormRef"
        :model="formValue"
        :rules="createRules"
        label-position="top"
      >
        <el-form-item prop="role_id" label="所属岗位：">
          <SearchRole
            v-model="formValue.role_id"
            style="width: 100%"
            clearable
            filterable
            remote
          />
        </el-form-item>
        <el-form-item prop="workwx_user_id" label="企业微信ID">
          <el-input
            v-model="formValue.workwx_user_id"
            clearable
            placeholder="请输入企业微信ID"
          />
        </el-form-item>
        <el-form-item prop="username" label="用户名：">
          <el-input
            v-model="formValue.username"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item prop="password" label="密码：">
          <el-input
            v-model="formValue.password"
            type="password"
            show-password
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item prop="c_password" label="确认密码：">
          <el-input
            v-model="formValue.c_password"
            type="password"
            show-password
            placeholder="请再次输入密码"
          />
        </el-form-item>
      </el-form>
    </ConfirmDialog>
    <ConfirmDialog
      v-model="editDialogVisible"
      width="500px"
      title="编辑用户"
      :submit-loading="submitLoading"
      @submit="editUserValidate"
    >
      <el-form
        ref="editUserFormRef"
        :model="editFormValue"
        :rules="createRules"
        label-position="top"
      >
        <el-form-item prop="role_id" label="所属岗位：">
          <SearchRole
            v-model="editFormValue.role_id"
            style="width: 100%"
            clearable
            filterable
          />
        </el-form-item>
        <el-form-item prop="workwx_user_id" label="企业微信ID">
          <el-input
            v-model="editFormValue.workwx_user_id"
            clearable
            placeholder="请输入企业微信ID"
          />
        </el-form-item>
        <el-form-item prop="username" label="用户名：">
          <el-input
            v-model="editFormValue.username"
            clearable
            placeholder="请输入用户名"
          />
        </el-form-item>
      </el-form>
    </ConfirmDialog>
    <ConfirmDialog
      v-model="nPasswordDialogVisible"
      width="400px"
      :submit-loading="submitLoading"
      title="重置密码"
      @submit="submitValidate"
    >
      <el-form
        ref="passwordFormRef"
        label-position="top"
        :model="{ newPassword }"
        :rules="{
          newPassword: {
            required: true,
            message: '新密码不能为空',
          },
        }"
      >
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="newPassword"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, unref } from "vue";
import TsxElementTable from "tsx-element-table";
import FilterContainer from "@/components/FilterContainer/index.vue";
import ConfirmDialog from "@/components/ConfirmDialog/index.vue";
import {
  filterColumns,
  tableColumns,
  handleLeftButtons,
  rules,
  FilterDto,
} from "./config";
import { PAGE, PAGE_SIZE } from "@/constants/app";
import * as API_USERS from "@/api/system/users";
import { ElMessage, FormInstance, type FormRules } from "element-plus";
import SearchRole from "../components/SearchRole/index.vue";
import { cloneDeep } from "lodash-es";
import { useMessageBox } from "@/hooks/useMessageBox";

const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const total = ref(100);
const loading = ref(false);
const tableData = ref<API_USERS.UserProps[]>([]);
const filterValue = ref<Partial<FilterDto>>();
const submitLoading = ref(false);

const createRules: FormRules = {
  ...rules,
  password: {
    required: true,
    message: "密码不能为空",
  },
  c_password: [
    {
      required: true,
      message: "确认密码不能为空",
    },
    {
      validator: (_rule, value, callback) => {
        if (value.trim() === "") {
          callback();
        } else if (value !== unref(formValue).password) {
          callback(new Error("两次输入密码不一致"));
        } else {
          callback();
        }
      },
    },
  ],
};

// 获取用户列表
const getListFun = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const { data } = await API_USERS.getUserList({
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

// 操作按钮点击
const handleClick = (key: string) => {
  if (key === "create") {
    formValue.value = {};
    dialogVisible.value = true;
    createUserFormRef.value?.resetFields();
  }
};

interface FormValueProps extends API_USERS.UserDto {
  c_password: string;
}

// 新增用户
const dialogVisible = ref(false);
const formValue = ref<Partial<FormValueProps>>({});
const createUserFormRef = ref<FormInstance | null>(null);
const createUserValidate = () => {
  unref(createUserFormRef)?.validate((nV: boolean) => {
    nV && createUserHandle();
  });
};
const createUserHandle = async () => {
  submitLoading.value = true;
  try {
    await API_USERS.createUser(unref(formValue) as API_USERS.UserDto);
    ElMessage.success("创建成功");
    getListFun();
    dialogVisible.value = false;
  } catch (err) {
    console.log(err);
  } finally {
    submitLoading.value = false;
  }
};

// 编辑用户
const editDialogVisible = ref(false);
const editFormValue = ref<Partial<API_USERS.EditUserDto>>({});
const tempUser = ref<API_USERS.UserProps | null>(null);
const editUserFormRef = ref<FormInstance | null>(null);
const editUserValidate = async () => {
  unref(editUserFormRef)?.validate((nV: boolean) => {
    nV && editUserHandle();
  });
};
const editFun = (row: API_USERS.UserProps) => {
  editDialogVisible.value = true;
  const cloneRow = cloneDeep(row);
  if ("password" in cloneRow) delete cloneRow.password;
  tempUser.value = cloneRow;
  editFormValue.value = cloneRow;
  editUserFormRef.value?.resetFields();
};
const editUserHandle = async () => {
  submitLoading.value = true;
  try {
    const editData = cloneDeep(unref(editFormValue));
    if (tempUser.value?.username === editData.username) {
      delete editData.username;
    }
    await API_USERS.editUser(editData as API_USERS.EditUserDto);
    ElMessage.success("编辑成功");
    getListFun();
    editDialogVisible.value = false;
  } catch (err) {
    console.log(err);
  } finally {
    submitLoading.value = false;
  }
};

// 修改密码
const newPassword = ref("");
const nPasswordDialogVisible = ref(false);
const nPasswordFormValue = ref<API_USERS.UserProps | null>(null);
const passwordFormRef = ref<FormInstance | null>(null);
const editPasswordFun = (row: API_USERS.UserProps) => {
  nPasswordFormValue.value = row;
  nPasswordDialogVisible.value = true;
  newPassword.value = "";
  passwordFormRef.value?.resetFields();
};
const submitValidate = () => {
  passwordFormRef.value?.validate(async (valid) => {
    if (valid) editPasswordHandle();
  });
};
const editPasswordHandle = async () => {
  if (!nPasswordFormValue.value) return ElMessage.error("用户不存在");
  submitLoading.value = true;
  try {
    await API_USERS.resetPassword({
      id: nPasswordFormValue.value.id,
      password: unref(newPassword),
    });
    ElMessage.success("修改成功");
    nPasswordDialogVisible.value = false;
  } catch (err) {
    console.log(err);
  } finally {
    submitLoading.value = false;
  }
};

// 删除用户
const deleteUser = (row: API_USERS.UserProps) => {
  useMessageBox("确认删除此用户？", async () => {
    try {
      await API_USERS.deleteUser(row.id);
      ElMessage.success("删除成功");
      getListFun();
    } catch (err) {
      console.log(err);
      ElMessage.error("删除失败");
    }
  });
};
</script>
<style lang="scss" scoped>
.selectTargetTitle {
  & > .desc {
    font-size: 12px;
    color: #cfcfcf;
  }
}
</style>
