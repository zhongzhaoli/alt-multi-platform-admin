<template>
  <ConfirmDialog v-model="visible" title="填写订单信息" width="500px" top="100px" @submit="submit">
    <div v-loading="loading">
      <div v-if="!loading && (!cardNumber || (noData && !cardInfo))" class="noData flex-center">
        暂无卡信息
      </div>
      <el-form
        v-else
        ref="formRef"
        label-position="left"
        label-width="140px"
        :rules="orderInfoRules"
        :model="formValue"
      >
        <el-row :gutter="14">
          <el-col :span="24">
            <el-form-item label="信用卡号：">
              <div class="d-flex justify-end w-100">
                <template v-if="cardInfo">
                  <el-input v-model="cardInfo.card_number" placeholder="请输入信用卡号" disabled />
                </template>
                <div v-else>暂无</div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="信用卡Cvv：">
              <div class="d-flex justify-end w-100">
                <template v-if="cardInfo">
                  <el-input v-model="cardInfo.cvv" placeholder="请输入信用卡cvv" disabled />
                </template>
                <div v-else>暂无</div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="信用卡有效期：">
              <div class="d-flex justify-end w-100">
                <template v-if="cardInfo">
                  <el-input
                    v-model="cardInfo.card_lifespan"
                    placeholder="请输入信用卡有效期"
                    disabled
                  />
                </template>
                <div v-else>暂无</div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="二步验证Token：">
              <div class="d-flex justify-end w-100">
                <div v-if="cardInfo && cardInfo.two_step_token">{{ cardInfo.two_step_token }}</div>
                <div v-else>暂无</div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="二步验证图片：">
              <div class="d-flex justify-end w-100">
                <div v-if="cardInfo && cardInfo.two_step">
                  <ImageLoad :token="true" :src="twoStepImageUrl(cardInfo.two_step)" />
                </div>
                <div v-else>暂无</div>
              </div>
            </el-form-item>
          </el-col>
          <div class="hr" />
          <el-col :span="24">
            <el-form-item label="订单金额：" prop="pay_amount">
              <div class="d-flex justify-end w-100">
                <el-input-number v-model="formValue.pay_amount" :precision="2" />
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="信用卡存活状态：" prop="card_status">
              <div class="d-flex justify-end w-100">
                <el-radio-group v-model="formValue.card_status">
                  <el-radio-button label="存活" value="存活" />
                  <el-radio-button label="死亡" value="死亡" />
                </el-radio-group>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="订单状态：" prop="status">
              <div class="d-flex justify-end w-100">
                <el-radio-group v-model="formValue.status">
                  <el-radio-button label="成功" :value="OrderStatusEnum.成功" />
                  <el-radio-button label="失败" :value="OrderStatusEnum.失败" />
                </el-radio-group>
              </div>
            </el-form-item>
          </el-col>
          <el-col v-if="formValue.status === OrderStatusEnum.失败" :span="24">
            <el-form-item label="失败原因" prop="fail_remark">
              <div class="d-flex justify-end w-100">
                <el-select v-model="formValue.fail_remark" placeholder="请选择失败原因">
                  <el-option label="行为异常" :value="OrderFailResonEnum.行为异常" />
                  <el-option label="其他" :value="OrderFailResonEnum.其他" />
                </el-select>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </ConfirmDialog>
</template>
<script setup lang="ts">
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import {
  OrderStatusEnum,
  OrderInfoSuccessProps,
  OrderInfoFailProps,
  OrderFailResonEnum,
  CardInfoProps,
  getCardInfo
} from '@/api/order/purchase';
import { orderInfoRules } from './rules';
import { twoStepImageUrl } from '@/api/order/creditCard';
import { useVModel } from '@vueuse/core';
import { ref, shallowRef, watch } from 'vue';
import ImageLoad from '@/components/ImageLoad/index.vue';
import { FormInstance } from 'element-plus';

interface ComponentProps {
  modelValue: boolean;
  cardNumber?: string;
  creatorType?: 'new' | 'old';
}
const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue', 'submit']);

const visible = useVModel(props, 'modelValue', emits);

const formValue = ref<OrderInfoSuccessProps | OrderInfoFailProps>({
  card_status: '存活',
  pay_amount: 0,
  status: OrderStatusEnum.成功,
  card_email: '',
  card_phone: '',
  email_pwd: ''
});

const loading = shallowRef(true);
const noData = shallowRef(false);
const formRef = ref<FormInstance | null>(null);
const cardInfo = ref<CardInfoProps | null>(null);

const getCardInfoFun = async () => {
  if (!props.cardNumber) return;
  loading.value = true;
  try {
    const { data } = await getCardInfo({
      card_number: props.cardNumber as string,
      page: 1,
      page_size: 1
    });
    const list = data?.list || [];
    if (list.length) {
      cardInfo.value = list[0];
    } else {
      noData.value = true;
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

watch([() => props.modelValue, () => props.cardNumber], ([nV1, nV2]) => {
  if (nV1 && nV2) {
    getCardInfoFun();
  }
});

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
