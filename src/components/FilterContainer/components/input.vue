<template>
  <div class="inputComponent d-flex" :class="{ prefixSelect: column.prefixSelect }">
    <template v-if="column.prefixSelect">
      <PrefixSelect
        v-model="fValue[`${column.prop}_${PREFIX_SELECT_VALUE}`]"
        :prefix-select="column.prefixSelect"
      />
    </template>
    <div class="mainComponent">
      <slot name="default" v-bind="{ row: column, form: fValue, change: submit }">
        <el-input
          v-model="fValue[column.prop]"
          :placeholder="column.placeholder || column.label || '请输入'"
          @keydown.enter="inputEnter"
        >
          <template v-if="!!column.multiple" #suffix>
            <el-popover ref="popoverRef" placement="bottom" :width="250" trigger="click">
              <template #reference>
                <div
                  class="btnBox"
                  :class="{
                    isActive: !!fValue[`${column.prop}_${MULTIPLE_INPUT_ACTIVE}`]
                  }"
                >
                  <i class="ri-list-check-3" />
                </div>
              </template>
              <el-input
                v-model="fValue[`${column.prop}_${MULTIPLE_INPUT_VALUE}`]"
                :input-style="{ fontSize: '12px' }"
                type="textarea"
                :rows="5"
                placeholder="精确搜索，一行一项，最多支持100行"
              />
              <div class="d-flex justify-end align-center" style="margin-top: 10px">
                <el-button size="small" @click="clear"> 清空 </el-button>
                <el-button size="small" type="primary" @click="submit"> 搜索 </el-button>
              </div>
            </el-popover>
          </template>
        </el-input>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { MULTIPLE_INPUT_VALUE, MULTIPLE_INPUT_ACTIVE, PREFIX_SELECT_VALUE } from '../constants';
import { shallowRef } from 'vue';
import { PopoverInstance } from 'element-plus';
import PrefixSelect from './prefixSelect.vue';
import { InputColumnProps } from '../types';
interface ComponentProps {
  modelValue: Record<string, any>;
  column: InputColumnProps;
}

const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue', 'submit']);

const fValue = useVModel(props, 'modelValue', emits, {
  deep: true
});

const popoverRef = shallowRef<PopoverInstance | null>(null);

const clear = () => {
  fValue.value[`${props.column.prop}_${MULTIPLE_INPUT_VALUE}`] = '';
  fValue.value[`${props.column.prop}_${MULTIPLE_INPUT_ACTIVE}`] = false;
  popoverRef.value?.hide();
  emits('submit');
};
const submit = () => {
  if (fValue.value[`${props.column.prop}_${MULTIPLE_INPUT_VALUE}`]) {
    fValue.value[`${props.column.prop}_${MULTIPLE_INPUT_ACTIVE}`] = true;
    popoverRef.value?.hide();
    emits('submit');
  }
};
const inputEnter = () => {
  fValue.value[`${props.column.prop}_${MULTIPLE_INPUT_ACTIVE}`] = false;
  emits('submit');
};
</script>
<style lang="scss" scoped>
.inputComponent {
  & > .mainComponent {
    flex: 1;
  }
  & .btnBox {
    &.isActive {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
    background-color: #f2f2f2;
    line-height: 20px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
    &:hover {
      background-color: #eaeaea;
    }
  }
}
</style>
