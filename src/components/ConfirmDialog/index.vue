<template>
  <el-dialog
    v-model="visible"
    :title="title"
    :width="width"
    :align-center="alignCenter"
    :show-close="showClose"
    @closed="closed"
    @close="close"
    @opened="opened"
    @open="open"
  >
    <template #header>
      <slot name="header" />
    </template>
    <slot />
    <template #footer>
      <slot name="footer">
        <el-button v-if="showConfirmBtn" type="primary" :loading="submitLoading" @click="submit">
          {{ confirmBtnText || CONFIRM_BTN_TEXT }}
        </el-button>
        <el-button v-if="showCancelBtn" @click="close">
          {{ cancelBtnText || CANCEL_BTN_TEXT }}
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { type ConfirmDialogProps } from './types';

const CONFIRM_BTN_TEXT = '确认';
const CANCEL_BTN_TEXT = '取消';

const props = withDefaults(defineProps<ConfirmDialogProps>(), {
  submitLoading: false,
  alignCenter: false,
  showClose: true,
  showCancelBtn: true,
  showConfirmBtn: true
});
const emits = defineEmits(['close', 'closed', 'update:modelValue', 'submit', 'opened', 'open']);
const visible = useVModel(props, 'modelValue', emits);

const close = () => {
  emits('update:modelValue', false);
  emits('close');
};

const closed = () => {
  emits('closed');
};

const submit = () => {
  emits('submit');
};

const opened = () => {
  emits('opened');
};

const open = () => {
  emits('open');
};
</script>
<style lang="scss" scoped></style>
