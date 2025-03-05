<template>
  <ConfirmDialog v-model="visible" title="填写信用卡信息" width="550px" @submit="submit">
    <el-form label-position="top">
      <el-row :gutter="14">
        <el-col :span="24">
          <el-form-item label="信用卡号：">
            <el-input v-model="formValue.card_number" placeholder="请输入信用卡号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用卡邮箱：">
            <el-input v-model="formValue.card_email" placeholder="请输入信用卡邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="邮箱密码：">
            <el-input v-model="formValue.email_pwd" placeholder="请输入邮箱密码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用卡手机号：">
            <el-input v-model="formValue.card_phone" placeholder="请输入信用卡手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用卡安全码（cvv）:">
            <el-input v-model="formValue.cvv" placeholder="请输入信用卡安全码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用卡地址：">
            <el-input v-model="formValue.card_path" placeholder="请输入信用卡地址" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用卡有效期：">
            <el-input v-model="formValue.card_lifespan" placeholder="信用卡有效期，例如：2024/10" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="二次验证信息：">
            <div class="fileBox">
              <ImageUpload @success="uploadSuccess" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </ConfirmDialog>
</template>
<script setup lang="ts">
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import ImageUpload from './ImageUpload.vue';
import { useVModel } from '@vueuse/core';
import { ref } from 'vue';
import { HandleCardProps } from '@/api/order/purchase';

interface ComponentProps {
  modelValue: boolean;
}
const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue', 'submit']);

const visible = useVModel(props, 'modelValue', emits);
const formValue = ref<HandleCardProps>({
  card_number: '',
  card_email: '',
  email_pwd: '',
  card_phone: '',
  cvv: '',
  card_path: '',
  card_lifespan: '',
  img: null
});

const uploadSuccess = (file: File) => {
  formValue.value.img = file;
};

const submit = () => {
  emits('submit', formValue.value);
};
</script>
<style lang="scss" scoped>
.fileBox {
  width: 150px;
  height: 150px;
}
</style>
