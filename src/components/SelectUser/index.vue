<template>
  <SelectLoadMore
    v-model="selectValue"
    :component-key="componentKey"
    placeholder="请输入查询 / 选择用户"
    :loading="loading"
    :loading-more="loadingMore"
    :multiple="multiple"
    :multiple-limit="multipleLimit"
    :remote="remote"
    :filterable="filterable"
    :remote-method="remoteMethod"
    :clearable="clearable"
    :list="
      (list || []).map((item) => ({
        label: item.user_name,
        value: item.user_id,
      }))
    "
    @change="selectChange"
    @load-more="loadMoreFun"
  />
</template>
<script setup lang="ts">
import { GetUserListDto, getUserList, UserProps } from '@/api/system/users';
import SelectLoadMore from '@/components/SelectLoadMore/index.vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import { Ref, ref, watch, nextTick, unref } from 'vue';

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

type idType = UserProps['user_id'];

const props = withDefaults(defineProps<ComponentProps>(), {
  clearable: false,
  multiple: false,
  defaultFirst: false,
  multipleLimit: 5,
  remote: false,
  filterable: false,
  componentKey: 'selectUser',
});
const emits = defineEmits(['update:modelValue', 'change']);
const selectValue: Ref<idType | idType[] | undefined> = ref(props.modelValue);

const list = ref<UserProps[]>([]);
const total = ref(0);
const page = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const loading = ref(true);
const loadingMore = ref(false);

const userName = ref('');

watch(
  () => props.modelValue,
  (nV: string | string[] | undefined) => {
    if (!nV || !nV.length) {
      userName.value = '';
    }
    selectValue.value = nV;
  },
  { immediate: true, deep: true }
);

const remoteMethod = (query?: string) => {
  userName.value = query || '';
  page.value = 1;
  getListFun(true);
};

const getListFun = async (first = false, loadMore = false) => {
  loadMore ? (loadingMore.value = true) : (loading.value = true);
  try {
    const params: GetUserListDto = {
      page: unref(page),
      page_size: unref(pageSize),
      user_search: true,
    };
    if (userName.value) {
      params.user_name = userName.value;
    }
    const { datas } = await getUserList(params);
    if (loadMore) {
      list.value = [...unref(list), ...(datas?.data || [])];
    } else {
      list.value = datas?.data || [];
    }
    total.value = datas?.total || 0;
    if (first && props.defaultFirst && unref(list).length) {
      const firstId = unref(list)[0].user_id;
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
  if (
    unref(list).length >= unref(total) ||
    unref(loading) ||
    unref(loadingMore)
  )
    return;
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
.selectedUserName {
  max-width: 90%;
  overflow: hidden;
  @include text-ellipsis(1);
  white-space: normal;
  line-height: 24px;
}
</style>
