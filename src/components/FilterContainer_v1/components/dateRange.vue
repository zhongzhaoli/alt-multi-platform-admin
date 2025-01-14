<template>
  <div
    class="dateRangeComponent d-flex"
    :class="{ prefixSelect: column.prefixSelect }"
  >
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
        :start-placeholder="column.startPlaceholder || '开始日期'"
        :end-placeholder="column.endPlaceholder || '结束日期'"
        :range-separator="column.rangeSeparator || '至'"
        type="daterange"
        @change="change"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { DateRangeColumnProps } from "../types";
import { PREFIX_SELECT_VALUE } from "../constants";
import prefixSelect from "./prefixSelect.vue";
import { nextTick } from "vue";

interface ComponentProps {
  modelValue: Record<string, any>;
  column: DateRangeColumnProps;
}

const props = defineProps<ComponentProps>();
const emits = defineEmits(["update:modelValue", "change"]);
const fValue = useVModel(props, "modelValue", emits, {
  deep: true,
});

const change = () => {
  nextTick(() => {
    emits("change");
  });
};
</script>
<style lang="scss" scoped>
.dateRangeComponent {
  & > .mainComponent {
    flex: 1;
    &:deep(.el-date-editor) {
      width: 100%;
      .el-range-input {
        height: 100%;
        line-height: 100%;
      }
    }
  }
}
</style>
