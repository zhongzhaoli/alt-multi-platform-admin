<template>
  <div class="filterContainer">
    <template v-for="column in columnsValue" :key="column.prop">
      <div
        class="filterItem"
        :style="{ width: `${column.width || DEFAULT_COLUMN_WIDTH}px` }"
      >
        <template v-if="column.type === 'input'">
          <Input v-model="filterValue" :column="column" @submit="preSubmit" />
        </template>
        <template v-else-if="column.type === 'select'">
          <Select v-model="filterValue" :column="column" />
        </template>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import type { FilterColumnProps, FilterContainerComponentProps } from "./types";
import { cloneDeep } from "lodash-es";
import {
  DEFAULT_COLUMN_WIDTH,
  MULTIPLE_INPUT_ACTIVE,
  MULTIPLE_INPUT_VALUE,
  PREFIX_SELECT_VALUE,
} from "./constants";
import Input from "./components/input.vue";
import Select from "./components/select.vue";
import { reactive, watch } from "vue";

const props = defineProps<FilterContainerComponentProps>();
const emits = defineEmits(["update:modelValue", "submit"]);

let filterValue = reactive(cloneDeep(props.modelValue));
// 单向获取
const columnsValue = useVModel(props, "columns", undefined, {
  clone: (values: FilterColumnProps[]) => {
    return cloneDeep(values);
  },
});

watch(
  columnsValue,
  (newColumns) => {
    newColumns.forEach((column) => {
      if (!filterValue[column.prop]) {
        filterValue[column.prop] = null;
        // 多选输入框
        if (column.multiple && column.type === "input") {
          filterValue[`${column.prop}_${MULTIPLE_INPUT_ACTIVE}`] = false;
          filterValue[`${column.prop}_${MULTIPLE_INPUT_VALUE}`] = "";
        }
        // 前缀下拉框
        if (column.prefixSelect) {
          const defaultPrefixSelectValue =
            typeof column.prefixSelect.options === "function"
              ? column.prefixSelect.options()[0].value
              : column.prefixSelect.options[0].value;
          filterValue[`${column.prop}_${PREFIX_SELECT_VALUE}`] =
            defaultPrefixSelectValue || "";
        }
      }
    });
  },
  {
    deep: true,
    immediate: true,
  },
);

watch(
  filterValue,
  (newFilterValue) => {
    emits("update:modelValue", dataHandle(cloneDeep(newFilterValue)));
  },
  {
    deep: true,
  },
);

// 多行数据处理
const multipleLineHandle = (text: string): Array<string> => {
  return text.split("\n").filter((item) => item);
};

// 做数据清洗
const dataHandle = (originValue: Record<string, any>): Record<string, any> => {
  const formValue: Record<string, any> = {};
  columnsValue.value.forEach(({ prop, type, multiple, prefixSelect }) => {
    const propValue = originValue[prop];
    const multiplePropValue =
      multiple && type === "input"
        ? multipleLineHandle(originValue[`${prop}_${MULTIPLE_INPUT_VALUE}`])
        : null;
    // 输入框数据处理
    if (type === "input") {
      formValue[
        prefixSelect ? originValue[`${prop}_${PREFIX_SELECT_VALUE}`] : prop
      ] =
        multiple && originValue[`${prop}_${MULTIPLE_INPUT_ACTIVE}`]
          ? multiplePropValue
          : propValue;
    }
    if (type === "select") {
      formValue[
        prefixSelect ? originValue[`${prop}_${PREFIX_SELECT_VALUE}`] : prop
      ] = propValue;
    }
  });
  return formValue;
};

const preSubmit = () => {
  const newValue = dataHandle(cloneDeep(filterValue));
  props.submitFun && props.submitFun(newValue);
  emits("submit", newValue);
};
</script>
<style lang="scss" scoped>
.filterContainer {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -8px;
  * {
    font-size: 13px;
  }
  & > .filterItem {
    margin: 0 8px;
    &:deep(.prefixSelect) {
      padding: 1px;
      box-sizing: border-box;
      border-radius: var(--el-border-radius-base);
      .el-input__wrapper {
        border-radius: 0 var(--el-border-radius-base)
          var(--el-border-radius-base) 0;
      }
      .el-select__wrapper {
        border-radius: 0 var(--el-border-radius-base)
          var(--el-border-radius-base) 0;
      }
    }
  }
}
</style>
