<template>
  <ConfirmDialog
    v-model="visible"
    title="填写账号信息"
    width="400px"
    top="100px"
    :show-close="false"
    @submit="submit"
    @closed="closed"
  >
    <el-form ref="formRef" label-position="top" :rules="bindAccountRules" :model="formValue">
      <el-row :gutter="14">
        <el-col :span="24">
          <el-form-item label="亚马逊邮箱" prop="card_email">
            <el-input v-model="formValue.card_email" placeholder="请输入亚马逊邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="亚马逊手机号:" prop="card_phone">
            <el-input v-model="formValue.card_phone" placeholder="请输入亚马逊手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="亚马逊密码：" prop="email_pwd">
            <el-input v-model="formValue.email_pwd" placeholder="请输入亚马逊密码" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </ConfirmDialog>
</template>
<script setup lang="ts">
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { useVModel } from '@vueuse/core';
import { bindAccountRules } from './rules';
import { ref } from 'vue';
import { BindAccountProps } from '@/api/orderDistribute/purchase';
import { FormInstance } from 'element-plus';

interface ComponentProps {
  modelValue: boolean;
}
const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue', 'submit']);

const visible = useVModel(props, 'modelValue', emits);
const formRef = ref<FormInstance | null>(null);
const formValue = ref<BindAccountProps>({
  card_email: '',
  card_phone: '',
  email_pwd: ''
});

const closed = () => {
  formRef.value?.resetFields();
};

const submit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      emits('submit', formValue.value);
    }
  });
};
</script>
<style lang="scss" scoped>
.fileBox {
  width: 150px;
  height: 150px;
}
</style>
