<template>
  <div
    class="prefixSelectComponent"
    :style="{ width: `${prefixSelect.width || DEFAULT_PREFIX_SELECT_WIDTH}px` }"
  >
    <el-select v-model="value">
      <template
        v-for="item in typeof prefixSelect.options === 'function'
          ? prefixSelect.options()
          : prefixSelect.options"
        :key="item.value"
      >
        <el-option :value="item.value" :label="item.label">
          {{ item.label }}
        </el-option>
      </template>
    </el-select>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { PrefixSelectProps } from "../types";
import { DEFAULT_PREFIX_SELECT_WIDTH } from "../constants";

interface ComponentProps {
  modelValue: string;
  prefixSelect: PrefixSelectProps;
}
const props = defineProps<ComponentProps>();
const emits = defineEmits(["update:modelValue"]);

const value = useVModel(props, "modelValue", emits);
</script>
<style lang="scss" scoped>
.prefixSelectComponent {
  margin-right: -1px;
  &:deep(.el-select__wrapper) {
    border-radius: var(--el-border-radius-base) 0 0 var(--el-border-radius-base) !important;
    &.is-focused {
      box-shadow: 0 0 0 1px var(--el-color-primary) inset;
      z-index: 2;
    }
    z-index: 0;
  }
}
</style>
