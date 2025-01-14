<template>
  <div
    class="dateComponent d-flex"
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
        type="date"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { DateColumnProps } from "../types";
import prefixSelect from "./prefixSelect.vue";
import { PREFIX_SELECT_VALUE } from "../constants";

interface ComponentProps {
  modelValue: Record<string, any>;
  column: DateColumnProps;
}

const props = defineProps<ComponentProps>();
const emits = defineEmits(["update:modelValue", "submit"]);

const fValue = useVModel(props, "modelValue", emits, {
  deep: true,
});
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
