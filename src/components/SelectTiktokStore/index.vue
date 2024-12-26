<template>
  <SelectLoadMore
    v-model="selectValue"
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
    :list="
      list.map((item) => ({
        label: item.shopName,
        value: item.shopId,
      }))
    "
    @change="selectChange"
    @load-more="loadMoreFun"
  />
</template>
<script setup lang="ts">
import {
  GetStoreDto,
  getStoreListAuth,
  StoreProps,
} from "@/api/system/tiktokStore";
import SelectLoadMore from "@/components/SelectLoadMore/index.vue";
import { PAGE, PAGE_SIZE } from "@/constants/app";
import { useVModel } from "@vueuse/core";
import { ref, watch, unref, nextTick } from "vue";

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

export type idType = StoreProps["shopId"];

const props = withDefaults(defineProps<ComponentProps>(), {
  clearable: true,
  multiple: false,
  defaultFirst: false,
  multipleLimit: 0,
  remote: true,
  filterable: true,
  componentKey: "selectWalmartStore",
});
const emits = defineEmits(["update:modelValue", "change"]);
const selectValue = useVModel(props, "modelValue", emits);

const list = ref<StoreProps[]>([]);
const total = ref(0);
const page = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const loading = ref(true);
const loadingMore = ref(false);

const shopName = ref("");

watch(
  () => props.modelValue,
  (nV: string | string[] | undefined) => {
    if (!nV || !nV.length) {
      shopName.value = "";
    }
    selectValue.value = nV;
  },
  { immediate: true, deep: true },
);

const remoteMethod = (query?: string) => {
  shopName.value = query || "";
  page.value = 1;
  getListFun();
};

const getListFun = async (first = false, loadMore = false) => {
  loadMore ? (loadingMore.value = true) : (loading.value = true);
  try {
    const params: GetStoreDto = {
      page: unref(page),
      pageSize: unref(pageSize),
    };
    if (shopName.value) {
      params.shopName = shopName.value;
    }
    const { datas } = await getStoreListAuth(params);
    if (loadMore) {
      list.value = [...unref(list), ...(datas?.data || [])];
    } else {
      list.value = datas?.data || [];
    }
    total.value = datas?.total || 0;
    if (first && props.defaultFirst && unref(list).length) {
      const firstId = unref(list)[0].shopId;
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
  nextTick(() => {
    emits("change");
  });
};

getListFun(true);
</script>
<style lang="scss" scoped>
@use "@/styles/mixins.scss" as *;
.selectedStoreName {
  max-width: 90%;
  overflow: hidden;
  @include text-ellipsis(1);
  white-space: normal;
  line-height: 24px;
}
</style>
