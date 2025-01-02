<template>
  <div class="selectTargetComponent">
    <Teleport to="body">
      <ConfirmDialog
        v-model="cVisible"
        width="400px"
        align-center
        class="bodyNoPadding hideHeader"
        @closed="closed"
        @close="close"
      >
        <template #footer>
          <div class="d-flex justify-space-between">
            <div>
              <el-button type="warning" @click="multipleAll">
                全选 / 取消
              </el-button>
            </div>
            <div>
              <el-button @click="cVisible = false">取消</el-button>
              <el-button
                type="primary"
                :loading="submitLoading"
                @click="submitFun"
              >
                确认
              </el-button>
            </div>
          </div>
        </template>
        <div v-loading="loading" class="Dialogbody">
          <div v-if="!closedVisible">
            <DataList
              :api="api"
              :avatar-shape="avatarShape"
              :name-key="nameKey"
              :value-key="valueKey"
              :multiple="multiple"
              :list="selectList"
              :loading="loading"
              :extra-params="extraParams"
              :select-all="selectAll"
              @change="selectChange"
            >
              <template #title="{ row }">
                <slot name="title" :row="row" :index="row.$index" />
              </template>
            </DataList>
          </div>
        </div>
      </ConfirmDialog>
    </Teleport>
  </div>
</template>
<script setup lang="ts">
import { watch } from "vue";
import ConfirmDialog from "../ConfirmDialog/index.vue";
import DataList from "./dataList.vue";
import { DEFAULT_AVATAR_SHAPE, AVATAR_SHAPE } from "@/constants/app";
import { useSelectTarget } from "./useSelectTarget";

export interface ComponentProps {
  nameKey?: string;
  valueKey?: string;
  api: (params?: any) => Promise<any>;
  multiple?: boolean;
  submitLoading?: boolean;
  defaultSelectList?: any;
  avatarShape?: AVATAR_SHAPE;
  loading?: boolean;
  extraParams?: Record<string, any>;
}
const props = withDefaults(defineProps<ComponentProps>(), {
  avatarShape: DEFAULT_AVATAR_SHAPE,
  defaultSelectList: [],
  nameKey: "name",
  valueKey: "id",
  multiple: true,
  submitLoading: false,
});
const emits = defineEmits(["submit", "close", "closed"]);

const {
  openDialog,
  closeDialog,
  closed,
  close,
  submitFun,
  selectChange,
  cVisible,
  closedVisible,
  selectList,
  multipleAll,
  selectAll,
} = useSelectTarget(emits);

watch(
  () => props.defaultSelectList,
  (nV) => {
    selectList.value = nV;
  },
  {
    immediate: true,
    deep: true,
  },
);

defineExpose({
  openDialog,
  closeDialog,
});
</script>
<style lang="scss" scoped></style>
