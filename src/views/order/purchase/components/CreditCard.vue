<template>
  <ConfirmDialog v-model="visible" title="填写信用卡信息" width="500px">
    <el-form label-position="top">
      <el-row :gutter="14">
        <el-col :span="24">
          <el-form-item label="信用卡号：">
            <el-input v-model="formValue.card_number" placeholder="请输入信用卡号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用卡邮箱：">
            <el-input v-model="formValue.card_email" placeholder="请输入信用卡邮箱" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用卡密码：">
            <el-input v-model="formValue.card_pwd" placeholder="请输入信用卡密码" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用卡手机号：">
            <el-input v-model="formValue.card_phone" placeholder="请输入信用卡手机号" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用卡安全码（cvv）:">
            <el-input v-model="formValue.cvv" placeholder="请输入信用卡安全码" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="信用卡地址：">
            <el-input
              v-model="formValue.card_address"
              :rows="4"
              placeholder="请输入信用卡地址"
              type="textarea"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </ConfirmDialog>
</template>
<script setup lang="ts">
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { useVModel } from '@vueuse/core';
import { ref } from 'vue';

interface ComponentProps {
  modelValue: boolean;
}
const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue']);

const visible = useVModel(props, 'modelValue', emits);
const formValue = ref({
  card_number: '',
  card_email: '',
  card_pwd: '',
  card_phone: '',
  cvv: '',
  card_address: ''
});
</script>
<style lang="scss" scoped></style>
