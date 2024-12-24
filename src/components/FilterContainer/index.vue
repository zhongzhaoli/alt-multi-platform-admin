<template>
  <div class="filterContainerComponent">
    <!-- :label-width="labelWidth || LABEL_WIDTH" -->
    <el-form
      v-model="formValue"
      :label-position="labelPosition || LABEL_POSITION"
      :size="size || ''"
      @submit.prevent
    >
      <el-row :gutter="gutter || GUTTER" class="align-center">
        <el-col
          v-for="item in columns"
          :key="item.prop"
          :xl="col || item.col || COL"
          :lg="8"
          :md="12"
        >
          <el-form-item :prop="item.prop">
            <slot :name="item.prop" v-bind="{ row: item, form: formValue }">
              <div class="d-inline-flex">
                <template v-if="item.prefixKey && item.prefixSelectOptions">
                  <div :class="{ prefixLeft: item.prefixKey && item.prefixSelectOptions }">
                    <PrepareSelect
                      v-model="formValue[item.prefixKey]"
                      :style="{ width: `${item.prefixWidth || PREFIX_WIDTH}px` }"
                      :list="item.prefixSelectOptions"
                    />
                  </div>
                </template>
                <div
                  :class="{
                    'w-100 d-flex': true,
                    prefixRight: item.prefixKey && item.prefixSelectOptions
                  }"
                >
                  <template v-if="!item.type || item.type === 'input'">
                    <el-input
                      v-model="formValue[item.prop]"
                      :class="{ prefixPadding: item.prefixKey && item.prefixSelectOptions }"
                      :placeholder="item.placeholder || `${item.label}`"
                      clearable
                      @keyup.enter="submit"
                    />
                  </template>
                  <template v-if="item.type === 'multiple'">
                    <MultipleInput
                      v-model="formValue[`${item.prop}${MULTIPLE_TEXT_SUFFIX}`]"
                      v-model:values="formValue[`${item.prop}${MULTIPLE_LIST_SUFFIX}`]"
                      :is-active="formValue[`${item.prop}${MULTIPLE_ACTIVE_SUFFIX}`]"
                      :placeholder="item.placeholder || `${item.label}`"
                      :class="{ prefixPadding: item.prefixKey && item.prefixSelectOptions }"
                      @multiple-submit="multipSubmit(item.prop)"
                      @multiple-clear="multipClear(item.prop)"
                      @submit="submit"
                    />
                  </template>
                  <template v-else-if="item.type === 'select'">
                    <el-select
                      v-model="formValue[item.prop]"
                      :class="{ prefixPadding: item.prefixKey && item.prefixSelectOptions }"
                      :placeholder="item.placeholder || `${item.label}`"
                      clearable
                      @change="submit"
                    >
                      <template v-if="item.selectOptions && item.selectOptions.length">
                        <el-option
                          v-for="option in item.selectOptions"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        />
                      </template>
                    </el-select>
                  </template>
                  <template v-else-if="item.type === 'date'">
                    <el-date-picker
                      v-model="formValue[item.prop]"
                      :placeholder="item.placeholder || `${item.label}`"
                      type="date"
                      format="YYYY-MM-DD"
                      value-format="YYYY-MM-DD"
                      clearable
                    />
                  </template>
                  <template v-else-if="item.type === 'dateRange'">
                    <el-date-picker
                      v-model="dateRangeValue"
                      type="daterange"
                      value-format="YYYY-MM-DD"
                      prefix-icon=""
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :shortcuts="shortcuts"
                      clearable
                      @change="(v: string[]) => dateRangeChange(v, item)"
                    />
                  </template>
                </div>
              </div>
            </slot>
          </el-form-item>
        </el-col>
        <div class="handleBtnBox">
          <el-form-item label-width="0">
            <el-button type="primary" @click="submit"> 搜索 </el-button>
            <el-button @click="reset"> 重置 </el-button>
          </el-form-item>
        </div>
      </el-row>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';
import { ELEMENT_UI_SIZE } from '@/constants/app';
import { FilterColumnsProp } from './types';
import MultipleInput from '../MultipleInput/index.vue';
import PrepareSelect from './prepareSelect.vue';
import { shortcuts } from '@/config/dateRange';
import { useDebounceFn } from '@vueuse/core';
import { pickBy } from 'lodash-es';
import {
  COL,
  GUTTER,
  LABEL_POSITION,
  MULTIPLE_ACTIVE_SUFFIX,
  MULTIPLE_LIST_SUFFIX,
  MULTIPLE_TEXT_SUFFIX,
  DATERANGE_START_KEY,
  DATERANGE_END_KEY,
  PREFIX_WIDTH
} from './constants';

interface ComponentProps {
  col?: number;
  btnCol?: number;
  labelWidth?: string;
  labelPosition?: 'left' | 'right';
  size?: ELEMENT_UI_SIZE;
  gutter?: number;
  columns: FilterColumnsProp[];
  submitFn?: (filterObject: any) => any;
  modelValue?: { [key: string]: any };
}
const props = defineProps<ComponentProps>();
const emits = defineEmits(['submit', 'update:modelValue', 'reset']);

// 搜索取值绑定
let formValue = reactive<any>({});

// 多选key存储起来
const multipleKeys = ref<Set<string>>(new Set());
// 日期联合选择key存储起来
const dateKeys = ref<Map<string, { startKey: string; endKey: string; optionsKeys: string[] }>>(
  new Map()
);
// 联合选择key存储起来
const jointKeys = ref<Map<string, { key: string; optionsKeys: string[] }>>(new Map());
// 创建对象
watch(
  () => props.columns,
  () => {
    multipleKeys.value.clear();
    dateKeys.value.clear();
    (props.columns || []).forEach((item) => {
      if (item.prefixKey && item.prefixSelectOptions && item.prefixSelectOptions.length)
        formValue[item.prefixKey] = item.prefixSelectOptions[0].value;
      formValue[item.prop] = (props.modelValue && props.modelValue[item.prop]) || undefined;
      if (item.type === 'select' && item.selectOptionsFun) {
        item.selectOptions = item.selectOptionsFun();
      }
      if (item.type === 'multiple') {
        multipleKeys.value.add(item.prop);
        // 多选情况下，要多几个key，存储不同的数据
        formValue[`${item.prop}${MULTIPLE_ACTIVE_SUFFIX}`] = false;
        formValue[`${item.prop}${MULTIPLE_LIST_SUFFIX}`] = [];
        formValue[`${item.prop}${MULTIPLE_TEXT_SUFFIX}`] = '';
      }
      if (item.prefixKey && item.prefixSelectOptions) {
        if (item.type === 'dateRange') {
          dateKeys.value.set(item.prefixKey, {
            startKey: item.startKey || DATERANGE_START_KEY,
            endKey: item.endKey || DATERANGE_END_KEY,
            optionsKeys: item.prefixSelectOptions.map((i) => i.value)
          });
        } else {
          jointKeys.value.set(item.prefixKey, {
            key: item.prop,
            optionsKeys: item.prefixSelectOptions.map((i) => i.value)
          });
        }
      }
    });
  },
  { immediate: true }
);

// 日期范围
const dateRangeValue = ref<string[] | null>(null);
// element的问题，清空，有时候会调用两次
const dateRangeChange = useDebounceFn((val: string[] | null, item: FilterColumnsProp) => {
  const { startKey, endKey } = item;
  let startDate = null;
  let endDate = null;
  if (val !== null && val.length === 2) {
    startDate = val[0];
    endDate = val[1];
  }
  if (!item.prefixKey) {
    formValue[startKey || DATERANGE_START_KEY] = startDate;
    formValue[endKey || DATERANGE_END_KEY] = endDate;
  } else {
    jointValueJudge();
  }
  submitFun();
}, 10);

// 过滤空值
const filterNull = (val: any) => {
  return pickBy(
    val,
    (value) =>
      (typeof value === 'string' && value !== undefined && value !== null && value !== '') ||
      (Array.isArray(value) && value.length)
  );
};

// 双向绑定监听
watch(
  formValue,
  (nV) => {
    // 多选处理
    multipleValueJudge();
    // 日期处理
    jointValueJudge();
    emits('update:modelValue', filterHandle(nV));
  },
  { deep: true }
);

const filterHandle = (obj: any) => {
  return filterNull(filterJointActive(filterMultipleActive(obj)));
};

// 过滤多选类型多余出来的key
const filterMultipleActive = (obj: any) => {
  const newObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (
      !key.endsWith(MULTIPLE_ACTIVE_SUFFIX) &&
      !key.endsWith(MULTIPLE_LIST_SUFFIX) &&
      !key.endsWith(MULTIPLE_TEXT_SUFFIX)
    ) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

// 过滤联合选择类型多余出来的key
const filterJointActive = (obj: any) => {
  const keys = jointKeys.value.keys();
  const dKeys = dateKeys.value.keys();
  for (const key of keys) {
    const jointItem = jointKeys.value.get(key);
    const retainKey = obj[key];
    delete obj[key];
    if (jointItem) {
      delete obj[jointItem.key];
      jointItem.optionsKeys.forEach((k) => {
        if (k !== retainKey) {
          delete obj[k];
        }
      });
    }
  }
  for (const key of dKeys) {
    const dateItem = dateKeys.value.get(key);
    if (dateItem) {
      const retainKey = [obj[key] + dateItem.startKey, obj[key] + dateItem.endKey];
      delete obj[key];
      delete obj[dateItem.startKey];
      delete obj[dateItem.endKey];
      dateItem.optionsKeys.forEach((k) => {
        const sK = k + dateItem.startKey;
        const eK = k + dateItem.endKey;
        if (!retainKey.includes(sK)) {
          delete obj[sK];
        }
        if (!retainKey.includes(eK)) {
          delete obj[eK];
        }
      });
    }
  }
  return obj;
};

// 联合选择处理
const jointValueJudge = () => {
  Object.keys(formValue).forEach((key) => {
    const dateMapItem = dateKeys.value.get(key);
    const jointSetItem = jointKeys.value.get(key);
    if (dateMapItem) {
      const dateValue = formValue[key];
      if (dateValue) {
        formValue[`${dateValue}${dateMapItem.startKey}`] = dateRangeValue.value?.[0] || undefined;
        formValue[`${dateValue}${dateMapItem.endKey}`] = dateRangeValue.value?.[1] || undefined;
      }
    }
    if (jointSetItem) {
      const jointValue = formValue[key];
      const value = formValue[jointSetItem.key];
      if (jointValue) {
        formValue[jointValue] = value;
      }
    }
  });
};

// 多选数据处理
const multipleValueJudge = () => {
  Object.keys(formValue).forEach((key) => {
    if (multipleKeys.value.has(key)) {
      if (formValue[`${key}${MULTIPLE_ACTIVE_SUFFIX}`]) {
        const listValue = formValue[`${key}${MULTIPLE_LIST_SUFFIX}`];
        if (listValue && listValue.length) {
          formValue[key] = JSON.stringify(listValue);
        } else {
          formValue[key] = '';
        }
      } else {
        const textValue = formValue[`${key}${MULTIPLE_TEXT_SUFFIX}`];
        if (textValue) {
          formValue[key] = JSON.stringify([textValue]);
        } else {
          formValue[key] = textValue;
        }
        formValue[`${key}${MULTIPLE_ACTIVE_SUFFIX}`] = false;
      }
    }
  });
};

// 搜索按钮点击 多选情况下 只读取单个
const submit = () => {
  multipleValueJudge();
  jointValueJudge();
  submitFun();
};

const submitFun = () => {
  nextTick(() => {
    const returnData = filterHandle(formValue);
    props.submitFn && props.submitFn(returnData);
    emits('submit', returnData);
  });
};

// 重置按钮点击
const reset = () => {
  dateRangeValue.value = null;
  props.columns.forEach((item) => {
    if (item.type === 'multiple') {
      formValue[`${item.prop}${MULTIPLE_ACTIVE_SUFFIX}`] = false;
      formValue[`${item.prop}${MULTIPLE_LIST_SUFFIX}`] = [];
      formValue[`${item.prop}${MULTIPLE_TEXT_SUFFIX}`] = '';
    }
    if (item.type === 'dateRange') {
      formValue[item.startKey || DATERANGE_START_KEY] = undefined;
      formValue[item.endKey || DATERANGE_END_KEY] = undefined;
      dateRangeValue.value = [];
    }
    if (item.prefixKey && item.prefixSelectOptions) {
      jointValueJudge();
    }
    formValue[item.prop] = undefined;
  });
  nextTick(() => {
    emits('reset');
  });
};

// 多选搜索按钮点击
const multipSubmit = (key: string) => {
  formValue[`${key}${MULTIPLE_ACTIVE_SUFFIX}`] = true;
  multipleValueJudge();
  jointValueJudge();
  submitFun();
};
const multipClear = (key: string) => {
  formValue[`${key}${MULTIPLE_ACTIVE_SUFFIX}`] = false;
  formValue[key] = JSON.stringify([formValue[`${key}${MULTIPLE_TEXT_SUFFIX}`]]);
  submitFun();
};
</script>
<style lang="scss" scoped>
.filterContainerComponent {
  background-color: #fff;
  border-radius: 5px;
  border: 1px solid var(--normal-border-color);
  padding-bottom: 0;
  & .handleBtnBox {
    margin-left: 6px;
  }
  & .prefixRight {
    height: 32px;
    display: inline-flex;
    align-items: flex-end;
    &:deep(.el-date-editor) {
      border-radius: 0 var(--el-border-radius-base) var(--el-border-radius-base) 0;
    }
    &:deep(.el-input__wrapper) {
      border-radius: 0 var(--el-border-radius-base) var(--el-border-radius-base) 0;
    }
  }

  & .prefixLeft {
    height: 32px;
    display: inline-flex;
    align-items: flex-end;
    &:deep(.el-select__selected-item) {
      text-align: center;
    }
  }

  &:deep(.el-date-editor) {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }

  &:deep(.el-select__wrapper) {
    width: 100%;
  }

  &:deep(input) {
    font-size: 12px;
  }
  &:deep(.el-select__selected-item) {
    font-size: 12px;
  }
  &:deep(.el-range-separator) {
    font-size: 12px;
  }

  &:deep(.el-form-item__content > div) {
    width: 100%;
  }
}
</style>
