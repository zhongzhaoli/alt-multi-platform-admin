<template>
  <div class="dateComponent d-flex" :class="{ prefixSelect: column.prefixSelect }">
    <template v-if="column.prefixSelect">
      <prefixSelect
        v-model="fValue[`${column.prop}_${PREFIX_SELECT_VALUE}`]"
        :prefix-select="column.prefixSelect"
      />
    </template>
    <div class="mainComponent">
      <el-date-picker
        v-model="fValue[column.prop]"
        :placeholder="column.placeholder || column.label || '请输入'"
        type="date"
        clearable
        :shortcuts="shortcuts"
        @change="change"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { DateColumnProps } from '../types';
import prefixSelect from './prefixSelect.vue';
import { PREFIX_SELECT_VALUE } from '../constants';
import { nextTick } from 'vue';
import { shortcuts } from '../shortcuts';

interface ComponentProps {
  modelValue: Record<string, any>;
  column: DateColumnProps;
}

const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue', 'change']);

const fValue = useVModel(props, 'modelValue', emits, {
  deep: true
});

const change = () => {
  nextTick(() => {
    emits('change');
  });
};
</script>
<style lang="scss" scoped>
.dateComponent {
  & > .mainComponent {
    flex: 1;
    &:deep(.el-date-editor) {
      width: 100%;
    }
  }
}
</style>
