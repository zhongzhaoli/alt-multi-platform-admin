<template>
  <Teleport to="body">
    <ConfirmDialog v-model="passwordVisible" width="400px" :submit-loading="loading" title="修改密码" @closed="closed" @submit="submitFun">
      <el-form ref="formRef" :model="passwordValue" :rules="rules" label-position="top">
        <el-form-item prop="old_password" label="旧密码">
          <el-input v-model="passwordValue.old_password" placeholder="请输入旧密码" type="password" show-password />
        </el-form-item>
        <el-form-item prop="new_password" label="新密码">
          <el-input v-model="passwordValue.new_password" placeholder="请输入新密码" type="password" show-password />
        </el-form-item>
        <el-form-item prop="confirm_password" label="确认密码">
          <el-input v-model="passwordValue.confirm_password" placeholder="请再次输入密码" type="password" show-password />
        </el-form-item>
      </el-form>
    </ConfirmDialog>
  </Teleport>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { ElMessage, FormRules, FormInstance } from 'element-plus';
import { cloneDeep } from 'lodash-es';
import { ChangePasswordDto, changePassword } from '@/api/user/user';

interface PasswordProps extends ChangePasswordDto {
  confirm_password: string;
}

// 修改密码
const passwordVisible = ref<boolean>(false);
const rules: FormRules = {
  old_password: {
    required: true,
    message: '旧密码不能为空'
  },
  new_password: {
    required: true,
    message: '新密码不能为空'
  },
  confirm_password: [
    {
      required: true,
      message: '确认密码不能为空'
    },
    {
      validator: (_rule, value, callback) => {
        if (value.trim() === '') {
          callback();
        } else if (value !== passwordValue.value.new_password) {
          callback(new Error('两次密码输入不一致'));
        } else {
          callback();
        }
      }
    }
  ]
};
const initPassword: PasswordProps = {
  old_password: '',
  new_password: '',
  confirm_password: ''
};
const passwordValue = ref<PasswordProps>(cloneDeep(initPassword));
const formRef = ref<FormInstance | null>(null);
const closed = () => {
  if (formRef.value) {
    formRef.value.resetFields();
  }
};
const loading = ref<boolean>(false);
const submitFun = () => {
  if (!formRef.value) return;
  formRef.value.validate(async (val: boolean) => {
    if (!val) return;
    loading.value = true;
    try {
      await changePassword({
        old_password: passwordValue.value.old_password,
        new_password: passwordValue.value.new_password
      });
      ElMessage.success('修改成功');
      passwordVisible.value = false;
    } catch (err) {
      console.log(err);
    } finally {
      loading.value = false;
    }
  });
};

const openDialog = () => {
  passwordVisible.value = true;
};

export interface ChangePasswordInstance {
  openDialog: () => void;
}

defineExpose({
  openDialog
});
</script>
<style scoped></style>
