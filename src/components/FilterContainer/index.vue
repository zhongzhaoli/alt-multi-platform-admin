<template>
  <div class="filterContainer">
    <template v-for="column in columnsValue" :key="column.prop">
      <div
        class="filterItem"
        :style="{
          width: `${column.width || DEFAULT_COLUMN_WIDTH}px`
        }"
      >
        <slot :name="column.prop" v-bind="{ row: column, form: filterValue, change: preSubmit }">
          <template v-if="column.type === 'input'">
            <Input v-model="filterValue" :column="column" @submit="preSubmit">
              <template v-if="column.prefixSelect">
                <slot
                  :name="`${column.prop}-main`"
                  v-bind="{ row: column, form: filterValue, change: preSubmit }"
                />
              </template>
            </Input>
          </template>
          <template v-else-if="column.type === 'select'">
            <Select v-model="filterValue" :column="column" @change="preSubmit" />
          </template>
          <template v-else-if="column.type === 'date'">
            <Date v-model="filterValue" :column="column" @change="preSubmit" />
          </template>
          <template v-else-if="column.type === 'dateRange'">
            <DateRange v-model="filterValue" :column="column" @change="preSubmit" />
          </template>
          <template v-else-if="column.type === 'numberRange'">
            <NumberRange v-model="filterValue" :column="column" @submit="preSubmit" />
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
import { useVModel } from '@vueuse/core';
import type { FilterColumnProps, FilterContainerComponentProps } from './types';
import { cloneDeep } from 'lodash-es';
import {
  DEFAULT_COLUMN_WIDTH,
  MULTIPLE_INPUT_ACTIVE,
  MULTIPLE_INPUT_VALUE,
  PREFIX_SELECT_VALUE,
  DEFAULT_DATERANGE_START_KEY,
  DEFAULT_DATERANGE_END_KEY,
  DEFAULT_NUMBERRANGE_START_KEY,
  DEFAULT_NUMBERRANGE_END_KEY
} from './constants';
import Input from './components/input.vue';
import Select from './components/select.vue';
import Date from './components/date.vue';
import DateRange from './components/dateRange.vue';
import NumberRange from './components/numberRange.vue';
import { nextTick, reactive, watch } from 'vue';

const props = defineProps<FilterContainerComponentProps>();
const emits = defineEmits(['update:modelValue', 'submit', 'reset']);

let filterValue = reactive(cloneDeep(props.modelValue));
// 单向获取
const columnsValue = useVModel(props, 'columns', undefined, {
  clone: (values: FilterColumnProps[]) => {
    return cloneDeep(values);
  }
});

// 多行数据处理
const multipleLineHandle = (text: string): Array<string> => {
  return text.split('\n').filter((item) => item);
};

// 数组数据处理
const arrayHandle = (value: any, handleFun?: (oValue: any[]) => string) => {
  if (Array.isArray(value)) {
    return handleFun ? handleFun(value) : JSON.stringify(value);
  } else {
    return value;
  }
};

// 日期格式化
const dateFormat = (date: Date): string => {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 做数据处理
const dataHandle = (originValue: Record<string, any>): Record<string, any> => {
  const formValue: Record<string, any> = {};
  columnsValue.value.forEach((column) => {
    const { prop, type, multiple, prefixSelect } = column;
    const propValue = originValue[prop];
    // 输入框数据处理
    if (type === 'input') {
      formValue[prefixSelect ? originValue[`${prop}_${PREFIX_SELECT_VALUE}`] : prop] =
        multiple && originValue[`${prop}_${MULTIPLE_INPUT_ACTIVE}`]
          ? arrayHandle(
              multipleLineHandle(originValue[`${prop}_${MULTIPLE_INPUT_VALUE}`]),
              column.arrayHandle
            )
          : multiple
            ? arrayHandle(propValue ? [propValue] : null, column.arrayHandle)
            : propValue;
    }
    if (type === 'select') {
      formValue[prefixSelect ? originValue[`${prop}_${PREFIX_SELECT_VALUE}`] : prop] = arrayHandle(
        propValue,
        column.arrayHandle
      );
    }
    if (type === 'date') {
      formValue[prefixSelect ? originValue[`${prop}_${PREFIX_SELECT_VALUE}`] : prop] =
        dateFormat(propValue);
    }
    if (type === 'dateRange') {
      const startKey = column.startKey || DEFAULT_DATERANGE_START_KEY;
      const endKey = column.endKey || DEFAULT_DATERANGE_END_KEY;
      formValue[
        prefixSelect ? `${originValue[`${prop}_${PREFIX_SELECT_VALUE}`]}_${startKey}` : startKey
      ] = propValue && propValue.length ? dateFormat(propValue[0]) : null;
      formValue[
        prefixSelect ? `${originValue[`${prop}_${PREFIX_SELECT_VALUE}`]}_${endKey}` : endKey
      ] = propValue && propValue.length ? dateFormat(propValue[1]) : null;
    }
    if (type === 'numberRange') {
      const startKey = column.startKey || DEFAULT_NUMBERRANGE_START_KEY;
      const endKey = column.endKey || DEFAULT_NUMBERRANGE_END_KEY;
      formValue[startKey] =
        (originValue && originValue[`${column.prop}_${DEFAULT_NUMBERRANGE_START_KEY}`]) ?? null;
      formValue[endKey] =
        (originValue && originValue[`${column.prop}_${DEFAULT_NUMBERRANGE_END_KEY}`]) ?? null;
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
      formValue[key] === '' ||
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
    if (!key.endsWith(PREFIX_SELECT_VALUE)) {
      filterValue[key] = null;
    }
  });
  nextTick(() => {
    props.resetFun && props.resetFun();
    emits('reset');
  });
};

const preSubmit = () => {
  const newValue = dataHandle(nullHandle(cloneDeep(filterValue)));
  nextTick(() => {
    props.submitFun && props.submitFun(newValue);
    emits('submit', newValue);
  });
};

watch(
  columnsValue,
  (newColumns) => {
    newColumns.forEach((column) => {
      if (!filterValue[column.prop]) {
        filterValue[column.prop] = null;
        // 多选输入框
        if (column.multiple && column.type === 'input') {
          filterValue[`${column.prop}_${MULTIPLE_INPUT_ACTIVE}`] = false;
          filterValue[`${column.prop}_${MULTIPLE_INPUT_VALUE}`] = '';
        }
        // 前缀下拉框
        if (column.prefixSelect) {
          const defaultPrefixSelectValue =
            typeof column.prefixSelect.options === 'function'
              ? column.prefixSelect.options()[0].value
              : column.prefixSelect.options[0].value;
          filterValue[`${column.prop}_${PREFIX_SELECT_VALUE}`] = defaultPrefixSelectValue || '';
        }
        // 日期范围
        if (column.type === 'dateRange') {
          const defaultStartDate = filterValue[column.startKey || DEFAULT_DATERANGE_START_KEY];
          const defaultEndDate = filterValue[column.endKey || DEFAULT_DATERANGE_END_KEY];
          filterValue[column.prop] =
            defaultStartDate && defaultEndDate
              ? [new window.Date(defaultStartDate), new window.Date(defaultEndDate)]
              : [];
          filterValue[column.startKey || DEFAULT_DATERANGE_START_KEY] = null;
          filterValue[column.endKey || DEFAULT_DATERANGE_END_KEY] = null;
        }
      }
    });
  },
  {
    deep: true,
    immediate: true
  }
);

watch(
  filterValue,
  (newFilterValue) => {
    emits('update:modelValue', dataHandle(nullHandle(cloneDeep(newFilterValue))));
  },
  {
    deep: true,
    immediate: true
  }
);
</script>
<style lang="scss" scoped>
.filterContainer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0 calc(-1 * (var(--normal-padding) / 2));
  &:deep(input) {
    font-size: 13px;
  }
  &:deep(.el-range-separator) {
    font-size: 13px;
  }
  &:deep(.el-select__placeholder) {
    font-size: 13px;
  }
  & > .filterItem {
    margin: 0 calc(var(--normal-padding) / 2) var(--normal-padding) calc(var(--normal-padding) / 2);
    &:deep(.prefixSelect) {
      padding: 1px;
      box-sizing: border-box;
      border-radius: var(--el-border-radius-base);
      .el-input__wrapper {
        border-radius: 0 var(--el-border-radius-base) var(--el-border-radius-base) 0;
      }
      .el-select__wrapper {
        border-radius: 0 var(--el-border-radius-base) var(--el-border-radius-base) 0;
      }
    }
  }
}
</style>
