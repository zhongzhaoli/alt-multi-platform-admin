<template>
  <ConfirmDialog
    v-model="visible"
    title="确认信用卡信息"
    width="500px"
    top="100px"
    @submit="submit"
  >
    <div v-loading="loading">
      <div v-if="!loading && (!cardNumber || (noData && !cardInfo))" class="noData flex-center">
        暂无卡信息
      </div>
      <el-form v-else label-position="left" label-width="130px">
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
        </el-row>
      </el-form>
    </div>
  </ConfirmDialog>
</template>
<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { ref, shallowRef, watch } from 'vue';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { CardInfoProps, getCardInfo } from '@/api/order/purchase';

interface ComponentProps {
  modelValue: boolean;
  cardNumber?: string;
}

const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue', 'submit']);
const visible = useVModel(props, 'modelValue', emits);
const loading = shallowRef(true);
const noData = shallowRef(false);
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

const submit = () => {
  emits('submit');
};

watch([() => props.modelValue, () => props.cardNumber], ([nV1, nV2]) => {
  if (nV1 && nV2) {
    getCardInfoFun();
  }
});
</script>
<style lang="scss" scoped>
.noData {
  border: 1px #eaeaea solid;
  height: 150px;
  border-radius: 4px;
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
