<template>
  <SelectLoadMore
    v-model="selectValue"
    :class="{ multiple }"
    :component-key="componentKey"
    placeholder="输入查询 / 选择店铺"
    :loading="loading"
    :loading-more="loadingMore"
    :multiple="multiple"
    :multiple-limit="multipleLimit"
    :remote="remote"
    :filterable="filterable"
    :remote-method="remoteMethod"
    :clearable="clearable"
    :list="realList"
    @change="selectChange"
    @load-more="loadMoreFun"
  />
</template>
<script setup lang="ts">
import { GetStoreDto, getStoreList, StoreProps } from '@/api/system/sheinStore';
import SelectLoadMore from '@/components/SelectLoadMore/index.vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { useVModel } from '@vueuse/core';
import { ref, watch, unref, nextTick, computed } from 'vue';

interface ComponentProps {
  modelValue: idType | idType[] | undefined;
  clearable?: boolean;
  // 默认选中第一个
  defaultFirst?: boolean;
  // 默认选项
  defaultOptions?: StoreProps[];
  // 多选
  multiple?: boolean;
  // 多选个数
  multipleLimit?: number;
  remote?: boolean;
  filterable?: boolean;
  componentKey?: string;
}

export type idType = StoreProps['shop_id'];

const props = withDefaults(defineProps<ComponentProps>(), {
  clearable: true,
  multiple: false,
  defaultFirst: false,
  multipleLimit: 0,
  remote: true,
  filterable: true,
  defaultOptions: () => [],
  componentKey: 'selectTiktokStore'
});
const emits = defineEmits(['update:modelValue', 'change']);
const selectValue = useVModel(props, 'modelValue', emits);

const list = ref<StoreProps[]>([]);
const total = ref(0);
const page = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const loading = ref(true);
const loadingMore = ref(false);

const shopName = ref('');

const realList = computed(() => {
  return [...props.defaultOptions, ...unref(list)].map((v) => ({
    label: v.shop_name,
    value: v.shop_id
  }));
});

watch(
  () => props.modelValue,
  (nV: string | string[] | undefined) => {
    if (!nV || !nV.length) {
      shopName.value = '';
    }
    selectValue.value = nV;
  },
  { immediate: true, deep: true }
);

const remoteMethod = (query?: string) => {
  shopName.value = query || '';
  page.value = 1;
  getListFun();
};

const getListFun = async (first = false, loadMore = false) => {
  loadMore ? (loadingMore.value = true) : (loading.value = true);
  try {
    const params: GetStoreDto = {
      page: unref(page),
      page_size: unref(pageSize)
    };
    if (shopName.value) {
      params.shop_name = shopName.value;
    }
    const { data } = await getStoreList(params);
    if (loadMore) {
      list.value = [...unref(list), ...(data?.list || [])];
    } else {
      list.value = data?.list || [];
    }
    total.value = data?.total || 0;
    if (first && props.defaultFirst && unref(list).length) {
      const firstId = unref(list)[0].shop_id;
      selectValue.value = props.multiple ? [firstId] : firstId;
      selectChange();
    }
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const loadMoreFun = () => {
  if (unref(list).length >= unref(total) || unref(loading) || unref(loadingMore)) return;
  page.value++;
  getListFun(false, true);
};

const selectChange = () => {
  nextTick(() => {
    emits('change');
  });
};

getListFun(true);
</script>
<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;
.selectedStoreName {
  max-width: 90%;
  overflow: hidden;
  @include text-ellipsis(1);
  white-space: normal;
  line-height: 24px;
}
</style>
