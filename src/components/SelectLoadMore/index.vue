<template>
  <div class="selectLoadMore">
    <el-select
      v-model="selectValue"
      :placeholder="placeholder"
      :remote="remote"
      :filterable="filterable"
      :remote-method="remoteMethod"
      :loading="loading"
      :multiple="multiple"
      :collapse-tags="multiple"
      :multiple-limit="multipleLimit"
      :popper-class="componentKey"
      :teleported="false"
      :clearable="clearable"
      @change="selectChange"
    >
      <slot name="options" v-bind="{ list }">
        <el-option v-for="item in list" :key="item.value" :label="item.label" :value="item.value">
          {{ item.label }}
        </el-option>
      </slot>
      <el-option v-if="loadingMore" value="#" label="加载中" disabled> 加载中 </el-option>
    </el-select>
  </div>
</template>
<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { onMounted, unref, onDeactivated, onBeforeUnmount, onActivated, shallowRef } from 'vue';

type idType = string | number;

interface ComponentProps {
  // 为了区分多个组件的情况，一个页面多个此组件，key得是唯一的，不然监听会出问题
  modelValue?: idType | idType[];
  componentKey: string;
  loading: boolean;
  remote?: boolean;
  filterable?: boolean;
  loadingMore: boolean;
  multiple?: boolean;
  multipleLimit?: number;
  clearable?: boolean;
  placeholder?: string;
  remoteMethod?: (query?: string) => void;
  list: { label: string; value: idType }[];
}

const props = withDefaults(defineProps<ComponentProps>(), {
  remote: false,
  filterable: false,
  multiple: false,
  multipleLimit: 0,
  clearable: false,
  placeholder: '请选择',
  remoteMethod: () => {}
});
const emits = defineEmits(['loadMore', 'update:modelValue', 'change']);
const domElementNode = shallowRef<HTMLElement | null>(null);

const selectValue = useVModel(props, 'modelValue', emits);

const selectChange = (val: idType | idType[]) => {
  emits('update:modelValue', val);
  emits('change', val);
};

const scrollEvent = () => {
  const dom = unref(domElementNode);
  if (dom) {
    const isBottom = dom.scrollHeight <= Math.ceil(dom.scrollTop) + dom.clientHeight;
    if (isBottom) emits('loadMore');
  }
};

// 取消事件监听
const cancelEventListener = () => {
  const dom = unref(domElementNode);
  if (dom) {
    dom.removeEventListener('scroll', scrollEvent);
    isRegister.value = false;
  }
};

// 注册事件监听
const registerEventListener = () => {
  if (unref(isRegister)) return;
  isRegister.value = true;
  // 获取dom节点
  domElementNode.value = document.querySelector(`.${props.componentKey} .el-select-dropdown__wrap`);
  const dom = unref(domElementNode);
  if (dom) {
    // 注册下拉滚动事件
    dom.addEventListener('scroll', scrollEvent);
  }
};

const isRegister = shallowRef(false);

onMounted(() => {
  registerEventListener();
});

onActivated(() => {
  registerEventListener();
});

onBeforeUnmount(() => {
  cancelEventListener();
});

onDeactivated(() => {
  cancelEventListener();
});
</script>
<style lang="scss" scoped>
.selectLoadMore {
  &:deep(.el-select__selection) {
    & > .el-select__selected-item {
      max-width: calc(100% - 70px);
      & > span {
        max-width: 100% !important;
      }
    }
    & > .el-select__selected-item.el-tooltip__trigger {
      width: unset;
    }
    & > .el-select__selected-item.el-select__input-wrapper {
      width: unset;
    }
  }
}
</style>
