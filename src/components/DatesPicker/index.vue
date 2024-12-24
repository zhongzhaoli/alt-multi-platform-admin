<template>
  <div class="datesPickerComponent">
    <div
      v-for="item in dateRange"
      :key="item.value"
      :class="{ active: selectedDateItem?.value === item.value }"
      @click="changeDateItem(item)"
    >
      {{ item.label }}
    </div>
    <div class="dateBox">
      <el-date-picker
        v-model="selectedDate"
        type="daterange"
        size="small"
        range-separator="至"
        value-format="YYYY-MM-DD"
        format="YYYY-MM-DD"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :shortcuts="shortcuts"
        style="width: 100%; box-sizing: border-box"
        :clearable="false"
        @change="selectedDateChange"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import { shortcuts } from '@/config/dateRange';
import { getTimeRangeData } from '@/utils';

export type DateItem = 'sevenDays' | 'oneMonth' | 'threeMonth' | 'oneYear';
interface DateRangeItem {
  label: string;
  value: DateItem;
  date: [Date, Date];
}
interface ComponentProps {
  modelValue: { [key: string]: string } | null;
  immediate?: DateItem | [Date, Date];
}
const emits = defineEmits(['change', 'update:modelValue']);
const props = defineProps<ComponentProps>();

const dateRange = ref<Array<DateRangeItem>>([
  {
    label: '近7天',
    value: 'sevenDays',
    // 因为后端是左右闭区间，所以 - 6 不是 - 7
    date: [new Date(new Date().setDate(new Date().getDate() - 6)), new Date()]
  },
  {
    label: '近1个月',
    value: 'oneMonth',
    date: [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()]
  },
  {
    label: '近3个月',
    value: 'threeMonth',
    date: [new Date(new Date().setMonth(new Date().getMonth() - 3)), new Date()]
  },
  {
    label: '最近1年',
    value: 'oneYear',
    date: [new Date(new Date().setFullYear(new Date().getFullYear() - 1)), new Date()]
  }
]);
const selectedDateItem = ref<DateRangeItem | null>(null);
const formValue = ref<Record<'start_date' | 'end_date', string> | null>(null);
const selectedDate = ref<[Date, Date] | null>(null);
const changeDateItem = (value: DateRangeItem) => {
  selectedDateItem.value = value;
  if (selectedDate.value) {
    selectedDate.value = null;
  }
  if (value && value.date && value.date.length) {
    setFormValue(selectedDateItem.value.date);
    emits('change', formValue.value);
  }
};
const selectedDateChange = () => {
  if (selectedDate.value) {
    selectedDateItem.value = null;
    setFormValue(selectedDate.value);
    emits('change', formValue.value);
  } else {
    if (!selectedDateItem.value) {
      selectedDateItem.value = dateRange.value[0];
      setFormValue(selectedDateItem.value.date);
      emits('change', formValue.value);
    }
  }
};
const setFormValue = (value: [Date, Date]) => {
  formValue.value = getTimeRangeData<'start_date' | 'end_date'>(value, 'start_date', 'end_date');
  emits('update:modelValue', formValue.value);
};

watch(
  () => props.immediate,
  (nV) => {
    if (nV) {
      if (Array.isArray(nV)) {
        selectedDate.value = nV;
        setFormValue(selectedDate.value);
      } else {
        const item = dateRange.value.find((item) => item.value === nV);
        selectedDateItem.value = item || dateRange.value[0];
        setFormValue(selectedDateItem.value.date);
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
);
</script>
<style lang="scss" scoped>
.datesPickerComponent {
  height: 30px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  & > div.dateBox {
    width: 200px;
    &:deep(.el-icon:last-child) {
      display: none;
    }
  }
  & > div:not(.dateBox) {
    font-size: 14px;
    cursor: pointer;
    color: #525252;
    position: relative;
    padding: 4px;
    box-sizing: border-box;
    transition: all 0.2s;
    &:not(:last-child) {
      margin-right: var(--normal-padding);
    }
    &::after {
      width: 100%;
      height: 2px;
      background: var(--el-color-primary);
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      opacity: 0;
      transition: all 0.2s;
    }
    @mixin selected-style {
      color: var(--el-color-primary);
      &::after {
        opacity: 1;
      }
    }
    &.active {
      @include selected-style;
    }
    &:hover {
      @include selected-style;
    }
  }
}
</style>
