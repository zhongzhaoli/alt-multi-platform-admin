<template>
  <div class="multipleInputComponent">
    <el-input
      v-model="formValue"
      :placeholder="placeholder"
      @change="inputChange"
      @keyup.enter="submitFun"
    >
      <template v-if="$slots.prefix" #prefix>
        <slot name="prefix" />
      </template>
      <template #suffix>
        <el-popover placement="bottom" :width="250" trigger="click">
          <template #reference>
            <div class="btnBox" :class="{ isActive }">
              <i class="ri-list-check-3" />
            </div>
          </template>
          <el-input
            v-model="formValueArrayText"
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
  </div>
</template>
<script setup lang="ts">
import { ref, watch, unref, nextTick } from 'vue';

type ArrayValueType = string[];
type ValueType = string;

interface ComponentProps {
  modelValue?: ValueType;
  values?: ArrayValueType;
  placeholder?: string;
  isActive?: boolean;
}

const props = withDefaults(defineProps<ComponentProps>(), {
  placeholder: '请输入',
  isActive: false
});
const emits = defineEmits([
  'update:modelValue',
  'update:values',
  'multipleSubmit',
  'multipleClear',
  'submit'
]);

const formValueArray = ref<Set<string>>(new Set());
const formValue = ref<ValueType>('');
const formValueArrayText = ref<string>('');

const submit = () => {
  updateData();
  nextTick(() => {
    emits('multipleSubmit');
  });
};

const updateData = () => {
  formValueArray.value.clear();
  unref(formValueArrayText)
    .split('\n')
    .forEach((val) => {
      if (val) formValueArray.value.add(val.trim());
    });
  emits('update:modelValue', formValue.value);
  emits('update:values', Array.from(formValueArray.value));
};

const clear = () => {
  formValueArrayText.value = '';
  updateData();
  nextTick(() => {
    emits('multipleClear');
  });
};

const submitFun = () => {
  emits('submit');
};

const inputChange = () => {
  updateData();
};

watch(
  () => props.modelValue,
  (nV) => {
    formValue.value = nV || '';
  },
  { immediate: true }
);

watch(
  () => props.values,
  (nV) => {
    formValueArray.value = new Set(nV || []);
  },
  {
    immediate: true,
    deep: true
  }
);
</script>
<style lang="scss" scoped>
.multipleInputComponent {
  width: 100%;
  &:deep(.el-input__wrapper) {
    padding-right: 8px;
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
