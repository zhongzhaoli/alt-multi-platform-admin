<template>
  <div class="SelectTargetDataComponent">
    <div class="searchBox">
      <el-input
        v-model="searchKey"
        clearable
        placeholder="请输入名字"
        @change="searchFun"
      >
        <template #prefix>
          <i class="ri-search-line" />
        </template>
      </el-input>
    </div>
    <Scroll
      v-loading="loading"
      :loading-more="loadingMore"
      :disabled="false"
      @load="loadMore"
    >
      <div class="dataList">
        <template v-if="list.length > 0 && !loading">
          <div
            v-for="(item, index) in list"
            :key="item.id"
            class="dataItem"
            @click.prevent="clickItem(item)"
          >
            <div class="dataItemLeft">
              <div v-if="item.avatar" class="avatar">
                <el-avatar :src="item.avatar" :size="32" :shape="avatarShape" />
              </div>
              <slot name="title" :row="item" :index="index">
                <span class="username">{{ item[uNameKey] }}</span>
              </slot>
            </div>
            <div class="dataItemRight">
              <div class="checkBox" :class="{ circle: !multiple }">
                <el-checkbox v-model="item.checked" @change="checkBoxChange" />
              </div>
            </div>
          </div>
        </template>
        <div v-if="!loading && list.length <= 0" class="noData flex-center">
          暂无数据
        </div>
      </div>
    </Scroll>
  </div>
</template>
<script setup lang="ts">
import Scroll from "./scroll.vue";
import { useDataList } from "./useDataList";
import { watchEffect, watch, nextTick } from "vue";
import { cloneDeep } from "lodash-es";
import { AVATAR_SHAPE } from "@/constants/app";
import { SystemResponsePageJson } from "@/config/request";

export interface ComponentProps {
  nameKey: string;
  valueKey: string;
  api: (params: any) => Promise<SystemResponsePageJson<any>>;
  list?: any;
  avatarShape: AVATAR_SHAPE;
  multiple: boolean;
  loading: boolean | undefined;
  extraParams?: Record<string, any>;
}

const props = withDefaults(defineProps<ComponentProps>(), {
  list: [],
});
const emits = defineEmits(["change"]);

const {
  uNameKey,
  uValueKey,
  loading,
  list,
  uApi,
  loadingMore,
  searchKey,
  defaultList,
  loadMore,
  searchFun,
  getListFun,
  checkBoxChange,
  clickItem,
  handleDefaultSelect,
} = useDataList(emits, props);

watchEffect(() => {
  uNameKey.value = props.nameKey;
  uValueKey.value = props.valueKey;
  uApi.value = props.api;
});

watch(
  () => props.list,
  (nV) => {
    defaultList.value = cloneDeep(nV);
    nextTick(() => {
      list.value = handleDefaultSelect();
    });
  },
  {
    immediate: true,
    deep: true,
  },
);
watch(
  () => props.loading,
  (nV) => {
    if (nV === false || nV === undefined) getListFun();
  },
  {
    immediate: true,
  },
);
</script>
<style lang="scss" scoped>
@use "@/styles/mixins.scss" as *;
.SelectTargetDataComponent {
  & > .searchBox {
    padding: 20px;
  }
  .dataList {
    padding: 0 20px;
    .noData {
      height: 50px;
      color: #777;
    }
    .dataItem {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #ebeef5;
      cursor: pointer;
      .dataItemLeft {
        flex: 1;
        display: flex;
        align-items: center;
        & > .avatar {
          margin-right: 14px;
        }
        & > .username {
          @include text-ellipsis(1);
        }
      }
      .dataItemRight {
        margin-left: 20px;
        & > .checkBox {
          width: 16px;
          height: 16px;
          :deep(.el-checkbox) {
            width: 100%;
            height: 100%;
          }
          &.circle {
            :deep(.el-checkbox__inner) {
              border-radius: 50%;
            }
          }
          :deep(.el-checkbox__inner) {
            width: 16px;
            height: 16px;
          }
          :deep(.el-checkbox__inner::after) {
            top: 2px;
            left: 5px;
          }
        }
      }
    }
  }
}
</style>
