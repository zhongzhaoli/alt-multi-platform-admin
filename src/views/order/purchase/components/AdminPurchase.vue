<template>
  <ConfirmDialog v-model="visible" title="填写订单信息" width="500px" top="100px" @submit="submit">
    <el-form
      ref="formRef"
      label-position="left"
      label-width="140px"
      :rules="orderInfoRules"
      :model="formValue"
    >
      <el-row :gutter="14">
        <el-col :span="24">
          <el-form-item label="订单金额：" prop="pay_amount">
            <div class="d-flex justify-end w-100">
              <el-input-number v-model="formValue.pay_amount" :precision="2" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="订单状态：" prop="status">
            <div class="d-flex justify-end w-100">
              <el-radio-group v-model="formValue.status">
                <el-radio-button label="成功" :value="OrderStatusEnum.管理员下单成功" />
                <el-radio-button label="失败" :value="OrderStatusEnum.管理员下单失败" />
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
        <el-col v-if="formValue.status === OrderStatusEnum.管理员下单失败" :span="24">
          <el-form-item label="失败原因" prop="fail_remark">
            <div class="d-flex justify-end w-100">
              <el-input v-model="formValue.fail_remark" placeholder="请输入失败原因" />
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </ConfirmDialog>
</template>
<script setup lang="ts">
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import {
  OrderStatusEnum,
  AdminPurchaseSuccessProps,
  AdminPurchaseFailProps
} from '@/api/order/purchase';
import { orderInfoRules } from './rules';
import { useVModel } from '@vueuse/core';
import { ref } from 'vue';
import { FormInstance } from 'element-plus';

interface ComponentProps {
  modelValue: boolean;
}
const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue', 'submit']);

const visible = useVModel(props, 'modelValue', emits);

const formValue = ref<AdminPurchaseSuccessProps | AdminPurchaseFailProps>({
  pay_amount: 0,
  status: OrderStatusEnum.管理员下单成功
});

const formRef = ref<FormInstance | null>(null);

const submit = () => {
  formRef.value?.validate((valid) => {
    if (valid) {
      emits('submit', formValue.value);
    }
  });
};
</script>
<style lang="scss" scoped>
.noData {
  border: 1px #eaeaea solid;
  height: 150px;
  border-radius: 4px;
}
.hr {
  margin-bottom: 20px;
  margin-top: 8px;
  width: 100%;
  height: 1px;
  background-color: #eaeaea;
}
.el-form-item {
  margin-bottom: 16px;
}
:deep(.el-form-item__error) {
  left: unset;
  right: 0;
}
.justify-end.w-100 {
  & > div {
    &.el-input-number,
    &.el-select,
    &.el-input {
      width: 200px;
    }
  }
}
</style>
