<template>
  <ConfirmDialog
    v-model="visible"
    title="填写信用卡信息"
    width="400px"
    top="100px"
    :show-close="false"
    @submit="submit"
    @closed="closed"
  >
    <el-form ref="formRef" label-position="top" :rules="creditCardRules" :model="formValue">
      <el-row :gutter="14">
        <el-col :span="24">
          <el-form-item label="信用卡号：" prop="card_number">
            <el-input v-model="formValue.card_number" placeholder="请输入信用卡号" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="信用卡安全码（cvv）:" prop="cvv">
            <el-input v-model="formValue.cvv" placeholder="请输入信用卡安全码" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="信用卡有效期：" prop="card_lifespan">
            <el-input v-model="formValue.card_lifespan" placeholder="信用卡有效期，例如：10/24" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </ConfirmDialog>
</template>
<script setup lang="ts">
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { useVModel } from '@vueuse/core';
import { creditCardRules } from './rules';
import { ref } from 'vue';
import { HandleCardProps } from '@/api/order/purchase';
import { FormInstance } from 'element-plus';

interface ComponentProps {
  modelValue: boolean;
}
const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue', 'submit']);

const visible = useVModel(props, 'modelValue', emits);
const formRef = ref<FormInstance | null>(null);
const formValue = ref<HandleCardProps>({
  card_number: '',
  cvv: '',
  card_lifespan: ''
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
