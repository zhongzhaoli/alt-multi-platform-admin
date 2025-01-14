<template>
  <div class="selectComponent d-flex" :class="{ prefixSelect: column.prefixSelect }">
    <template v-if="column.prefixSelect">
      <prefixSelect
        v-model="fValue[`${column.prop}_${PREFIX_SELECT_VALUE}`]"
        :prefix-select="column.prefixSelect"
      />
    </template>
    <div class="mainComponent">
      <el-select
        v-model="fValue[column.prop]"
        :multiple="column.multiple"
        :multiple-limit="multipleLimit"
        :collapse-tags="multipleCollapseTags"
        :placeholder="column.placeholder || column.label || '请选择'"
        clearable
        @change="change"
      >
        <template
          v-for="item in typeof column.selectOptions === 'function'
            ? column.selectOptions()
            : column.selectOptions"
          :key="item.value"
        >
          <el-option :value="item.value" :label="item.label">
            {{ item.label }}
          </el-option>
        </template>
      </el-select>
    </div>
  </div>
</template>
<script setup lang="ts">
import { SelectColumnProps } from '../types';
import {
  PREFIX_SELECT_VALUE,
  DEFAULT_SELECT_LIMIT,
  DEFAULT_SELECT_COLLAPSE_TAGS
} from '../constants';
import prefixSelect from './prefixSelect.vue';
import { useVModel } from '@vueuse/core';
import { computed, nextTick } from 'vue';

interface ComponentProps {
  modelValue: Record<string, any>;
  column: SelectColumnProps;
}

const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue', 'change']);

const multipleLimit = computed(() => {
  return props.column.multiple && typeof props.column.multiple !== 'boolean'
    ? props.column.multiple.multipleLimit
    : DEFAULT_SELECT_LIMIT;
});

const multipleCollapseTags = computed(() => {
  return props.column.multiple && typeof props.column.multiple !== 'boolean'
    ? props.column.multiple.collapseTags
    : DEFAULT_SELECT_COLLAPSE_TAGS;
});

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
.selectComponent {
  & > .mainComponent {
    flex: 1;
  }
}
</style>
