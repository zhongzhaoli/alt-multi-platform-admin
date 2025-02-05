<template>
  <Teleport to="body">
    <ConfirmDialog
      v-model="visible"
      class="feedDetailDialog"
      title="Feed ID 详情"
      :show-close="false"
      :show-confirm-btn="false"
      @closed="emits('closed')"
    >
      <div class="tableBox">
        <TsxElementTable
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :table-columns="config.feedDetailTableColumns"
          :handle="{ show: false }"
          :table="{
            data: detailList,
            loading: detailLoading,
            border: true,
            defaultExpandAll: true
          }"
          :pagination="{
            total: detailTotal
          }"
          @page-change="getFeedDetail"
        >
          <template #table-expand="{ row }">
            <template v-if="row.ingestion_status === 'SUCCESS'">
              <ViewJson :value="row.product_identifiers || {}" :expand-depth="5" />
            </template>
            <template v-else>
              <ViewJson :value="row.ingestion_errors || {}" :expand-depth="5" />
            </template>
          </template>
        </TsxElementTable>
      </div>
    </ConfirmDialog>
  </Teleport>
</template>
<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import * as config from '../config';
import { FeedDetailProps, getWalmartDetail } from '@/api/listing/index';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import TsxElementTable from 'tsx-element-table';
import { shallowRef, watch } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import ViewJson from 'vue-json-viewer';

interface ComponentProps {
  modelValue: boolean;
  feedId: string | null;
}

const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue', 'closed']);

const visible = useVModel(props, 'modelValue', emits);

const detailLoading = shallowRef(false);
const detailList = shallowRef<FeedDetailProps[]>([]);
const detailTotal = shallowRef(0);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const getFeedDetail = async () => {
  if (!props.feedId) return;
  try {
    detailLoading.value = true;
    const { data } = await getWalmartDetail({
      page: page.value,
      page_size: pageSize.value,
      feed_id: props.feedId
    });
    detailList.value = data?.list || [];
    detailTotal.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    detailLoading.value = false;
  }
};

watch(
  visible,
  (val) => {
    if (val && props.feedId) {
      getFeedDetail();
    }
  },
  {
    immediate: true
  }
);
</script>
<style lang="scss" scoped>
.exportBtn {
  margin-left: var(--normal-padding);
}
</style>
<style lang="scss">
.feedDetailDialog {
  width: calc(100% - 40px);
  height: calc(100vh - 40px);
  margin: 20px 0 0 20px;
  display: flex;
  flex-direction: column;
  & > .el-dialog__body {
    height: calc(100% - 72px - 72px);
    overflow: auto;
    & .tableBox {
      height: 100%;
      & .el-table__expanded-cell {
        background-color: #f7f7f7 !important;
        padding: 0;
        & .jv-container {
          background-color: transparent;
          & > .jv-code {
            padding: calc(var(--normal-padding) * 2);
            background-color: transparent;
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
