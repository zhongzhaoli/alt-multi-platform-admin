<template>
  <SelectLoadMore
    v-model="selectValue"
    :component-key="componentKey"
    placeholder="请输入查询 / 选择岗位"
    :loading="loading"
    :loading-more="loadingMore"
    :multiple="multiple"
    :multiple-limit="multipleLimit"
    :remote="remote"
    :filterable="filterable"
    :remote-method="remoteMethod"
    :clearable="clearable"
    :list="
      list.map((item) => ({
        label: item.role_name,
        value: item.role_id
      }))
    "
    @change="selectChange"
    @load-more="loadMoreFun"
  />
</template>
<script setup lang="ts">
import SelectLoadMore from '@/components/SelectLoadMore/index.vue';
import { PAGE } from '@/constants/app';
import { Ref, ref, watch, nextTick, unref } from 'vue';
import { type RoleProps, getRoleList } from '@/api/system/role';

interface ComponentProps {
  modelValue: idType | idType[] | undefined;
  clearable?: boolean;
  // 默认选中第一个
  defaultFirst?: boolean;
  // 多选
  multiple?: boolean;
  // 多选个数
  multipleLimit?: number;
  remote?: boolean;
  filterable?: boolean;
  componentKey?: string;
}

type idType = RoleProps['role_id'];

const props = withDefaults(defineProps<ComponentProps>(), {
  clearable: false,
  multiple: false,
  defaultFirst: false,
  multipleLimit: 5,
  remote: false,
  filterable: false,
  componentKey: 'selectRolement'
});
const emits = defineEmits(['update:modelValue', 'change']);
const selectValue: Ref<idType | idType[] | undefined> = ref(props.modelValue);

const list = ref<RoleProps[]>([]);
const total = ref(0);
const page = ref(PAGE);
const pageSize = ref(99);
const loading = ref(true);
const loadingMore = ref(false);

const roleName = ref('');

watch(
  () => props.modelValue,
  (nV: string | string[] | undefined) => {
    if (!nV || !nV.length) {
      roleName.value = '';
    }
    selectValue.value = nV;
  },
  { immediate: true, deep: true }
);

const remoteMethod = (query?: string) => {
  roleName.value = query || '';
  page.value = 1;
  getListFun();
};

const getListFun = async (first = false, loadMore = false) => {
  loadMore ? (loadingMore.value = true) : (loading.value = true);
  try {
    const { data } = await getRoleList({
      page: unref(page),
      page_size: unref(pageSize),
      role_name: unref(roleName)
    });
    if (loadMore) {
      list.value = [...unref(list), ...(data?.data || [])];
    } else {
      list.value = data?.data || [];
    }
    total.value = data?.total || 0;
    if (first && props.defaultFirst && unref(list).length) {
      const firstId = unref(list)[0].role_id;
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
  emits('update:modelValue', selectValue.value);
  nextTick(() => {
    emits('change');
  });
};

getListFun(true);
</script>
<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;
.selectedRoleName {
  max-width: 90%;
  overflow: hidden;
  @include text-ellipsis(1);
  white-space: normal;
  line-height: 24px;
}
</style>
