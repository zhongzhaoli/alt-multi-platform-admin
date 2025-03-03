<template>
  <ConfirmDialog v-model="visible" title="填写订单信息" width="350px">
    <el-form label-position="left" label-width="130px">
      <el-row :gutter="14">
        <el-col :span="24">
          <el-form-item label="订单金额：">
            <div class="d-flex justify-end w-100">
              <el-input-number v-model="formValue.order_amount" :precision="2" />
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="订单状态：">
            <div class="d-flex justify-end w-100">
              <el-radio-group v-model="formValue.order_status">
                <el-radio-button label="成功" value="success" />
                <el-radio-button label="失败" value="fail" />
              </el-radio-group>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="信用卡存活状态：">
            <div class="d-flex justify-end w-100">
              <el-radio-group v-model="formValue.card_state">
                <el-radio-button label="存活" value="alive" />
                <el-radio-button label="死亡" value="dead" />
              </el-radio-group>
            </div>
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
  card_state: 'alive',
  order_amount: 0,
  order_status: 'success'
});
</script>
<style lang="scss" scoped></style>
