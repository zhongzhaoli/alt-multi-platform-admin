<template>
  <div class="filterContainer">
    <template v-for="column in columnsValue" :key="column.prop">
      <div
        class="filterItem"
        :style="{
          width: `${column.width || DEFAULT_COLUMN_WIDTH}px`,
        }"
      >
        <slot :name="column.prop" v-bind="{ row: column, form: filterValue }">
          <template v-if="column.type === 'input'">
            <Input v-model="filterValue" :column="column" @submit="preSubmit" />
          </template>
          <template v-else-if="column.type === 'select'">
            <Select
              v-model="filterValue"
              :column="column"
              @change="preSubmit"
            />
          </template>
          <template v-else-if="column.type === 'date'">
            <Date v-model="filterValue" :column="column" @change="preSubmit" />
          </template>
          <template v-else-if="column.type === 'dateRange'">
            <DateRange
              v-model="filterValue"
              :column="column"
              @change="preSubmit"
            />
          </template>
          <template v-else>No Target Component!</template>
        </slot>
      </div>
    </template>
    <div class="filterItem">
      <el-button type="primary" @click="submit">搜索</el-button>
      <el-button @click="reset">重置</el-button>
    </div>
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
  DEFAULT_DATERANGE_START_KEY,
  DEFAULT_DATERANGE_END_KEY,
} from "./constants";
import Input from "./components/input.vue";
import Select from "./components/select.vue";
import Date from "./components/date.vue";
import DateRange from "./components/dateRange.vue";
import { nextTick, reactive, watch } from "vue";

const props = defineProps<FilterContainerComponentProps>();
const emits = defineEmits(["update:modelValue", "submit", "reset"]);

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
        // 日期范围
        if (column.type === "dateRange") {
          filterValue[column.prop] = [];
          filterValue[column.startKey || DEFAULT_DATERANGE_START_KEY] = null;
          filterValue[column.endKey || DEFAULT_DATERANGE_END_KEY] = null;
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
    emits(
      "update:modelValue",
      dataHandle(nullHandle(cloneDeep(newFilterValue))),
    );
  },
  {
    deep: true,
  },
);

// 多行数据处理
const multipleLineHandle = (text: string): Array<string> => {
  return text.split("\n").filter((item) => item);
};

// 数组数据处理
const arrayHandle = (value: any, handleFun?: (oValue: any[]) => string) => {
  if (Array.isArray(value)) {
    return handleFun ? handleFun(value) : value;
  } else {
    return value;
  }
};

// 做数据处理
const dataHandle = (originValue: Record<string, any>): Record<string, any> => {
  const formValue: Record<string, any> = {};
  columnsValue.value.forEach((column) => {
    const { prop, type, multiple, prefixSelect } = column;
    const propValue = originValue[prop];
    // 输入框数据处理
    if (type === "input") {
      formValue[
        prefixSelect ? originValue[`${prop}_${PREFIX_SELECT_VALUE}`] : prop
      ] =
        multiple && originValue[`${prop}_${MULTIPLE_INPUT_ACTIVE}`]
          ? arrayHandle(
              multipleLineHandle(
                originValue[`${prop}_${MULTIPLE_INPUT_VALUE}`],
              ),
              column.arrayHandle,
            )
          : propValue;
    }
    if (type === "select") {
      formValue[
        prefixSelect ? originValue[`${prop}_${PREFIX_SELECT_VALUE}`] : prop
      ] = arrayHandle(propValue, column.arrayHandle);
    }
    if (type === "date") {
      formValue[
        prefixSelect ? originValue[`${prop}_${PREFIX_SELECT_VALUE}`] : prop
      ] = propValue;
    }
    if (type === "dateRange") {
      const startKey = column.startKey || DEFAULT_DATERANGE_START_KEY;
      const endKey = column.endKey || DEFAULT_DATERANGE_END_KEY;
      formValue[
        prefixSelect
          ? `${originValue[`${prop}_${PREFIX_SELECT_VALUE}`]}_${startKey}`
          : startKey
      ] = propValue && propValue.length ? propValue[0] : null;
      formValue[
        prefixSelect
          ? `${originValue[`${prop}_${PREFIX_SELECT_VALUE}`]}_${endKey}`
          : endKey
      ] = propValue && propValue.length ? propValue[1] : null;
    }
  });
  return formValue;
};

// 空值过滤
const nullHandle = (formValue: Record<string, any>): Record<string, any> => {
  const newValue: Record<string, any> = {};
  Object.keys(formValue).forEach((key) => {
    if (
      formValue[key] === null ||
      formValue[key] === undefined ||
      formValue[key] === "" ||
      (Array.isArray(formValue[key]) && !formValue[key].length)
    ) {
      return;
    } else {
      newValue[key] = formValue[key];
    }
  });
  return newValue;
};

// 搜索按钮点击
const submit = () => {
  preSubmit();
};

// 重置按钮点击
const reset = () => {
  Object.keys(filterValue).forEach((key) => {
    filterValue[key] = null;
  });
  nextTick(() => {
    props.resetFun && props.resetFun();
    emits("reset");
  });
};

const preSubmit = () => {
  const newValue = dataHandle(nullHandle(cloneDeep(filterValue)));
  nextTick(() => {
    props.submitFun && props.submitFun(newValue);
    emits("submit", newValue);
  });
};
</script>
<style lang="scss" scoped>
.filterContainer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
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
