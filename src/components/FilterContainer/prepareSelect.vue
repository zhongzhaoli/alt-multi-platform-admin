<template>
  <el-select v-model="value" size="small" @change="selectChange" @click.stop>
    <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { FilterSelectOptionsProp } from './types';

interface ComponentProps {
  modelValue: string | undefined;
  list: FilterSelectOptionsProp[];
}
const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue', 'change']);

const value = ref<string | undefined>(props.modelValue);

const selectChange = () => {
  emits('update:modelValue', value.value);
  emits('change');
};

watch(
  () => props.modelValue,
  (val) => {
    value.value = val;
  },
  {
    immediate: true
  }
);
</script>
<style lang="scss" scoped>
.el-select {
  height: 32px;
  margin-right: -1px;
  &:deep(.el-select__wrapper) {
    height: 100%;
    border-radius: var(--el-border-radius-base) 0 0 var(--el-border-radius-base);
    &.is-focused {
      z-index: 2;
    }
  }
}
</style>
