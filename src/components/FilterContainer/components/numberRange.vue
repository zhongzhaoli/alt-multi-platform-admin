<template>
  <div class="numberRangeComponent d-flex">
    <el-popover ref="popoverRef" placement="bottom" :width="200" trigger="click">
      <div class="d-flex align-center">
        <el-input-number
          v-model="fValue[`${column.prop}_${DEFAULT_NUMBERRANGE_START_KEY}`]"
          placeholder="开始值"
          :precision="column.precision || 0"
          :controls="false"
        />
        <div class="rangeSeparator">~</div>
        <el-input-number
          v-model="fValue[`${column.prop}_${DEFAULT_NUMBERRANGE_END_KEY}`]"
          placeholder="结束值"
          :precision="column.precision || 0"
          :controls="false"
        />
      </div>
      <div class="d-flex justify-end align-center" style="margin-top: 10px">
        <el-button size="small" @click="clear"> 清空 </el-button>
        <el-button size="small" type="primary" @click="submit"> 搜索 </el-button>
      </div>
      <template #reference>
        <div class="inputBox">
          <div class="mb" />
          <el-input
            v-model="tempRangeText"
            :placeholder="column.placeholder || column.label || '请输入'"
          />
        </div>
      </template>
    </el-popover>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { NumberRangeColumnProps } from '../types';
import { DEFAULT_NUMBERRANGE_END_KEY, DEFAULT_NUMBERRANGE_START_KEY } from '../constants';
import { ref } from 'vue';
import { PopoverInstance } from 'element-plus';

interface ComponentProps {
  modelValue: Record<string, any>;
  column: NumberRangeColumnProps;
}

const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue', 'submit']);

const tempRangeText = ref<string>('');
const popoverRef = ref<PopoverInstance | null>(null);

const fValue = useVModel(props, 'modelValue', emits, {
  deep: true
});

const clear = () => {
  fValue.value[`${props.column.prop}_${DEFAULT_NUMBERRANGE_START_KEY}`] = '';
  fValue.value[`${props.column.prop}_${DEFAULT_NUMBERRANGE_END_KEY}`] = '';
  tempRangeText.value = '';
  popoverRef.value?.hide();
  emits('submit');
};

const submit = () => {
  const tempValue = [
    fValue.value[`${props.column.prop}_${DEFAULT_NUMBERRANGE_START_KEY}`],
    fValue.value[`${props.column.prop}_${DEFAULT_NUMBERRANGE_END_KEY}`]
  ];
  if (tempValue.filter((v) => v).length === 0) {
    tempRangeText.value = '';
  } else {
    tempRangeText.value = tempValue.join(' ~ ');
  }
  popoverRef.value?.hide();
  emits('submit');
};
</script>
<style lang="scss" scoped>
.numberRangeComponent {
  & .inputBox {
    width: 100%;
    position: relative;
    & > .mb {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 899;
      cursor: pointer;
    }
  }
}
.rangeSeparator {
  font-size: 20px;
  width: 20px;
  text-align: center;
}
.el-input-number {
  flex: 1;
  &:deep(input) {
    font-size: 13px;
  }
}
</style>
