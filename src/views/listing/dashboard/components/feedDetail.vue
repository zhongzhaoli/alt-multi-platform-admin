<template>
  <Teleport to="body">
    <ConfirmDialog
      v-model="visible"
      class="feedDetailDialog"
      title="Feed ID 详情"
      :show-close="false"
      :show-confirm-btn="false"
      @closed="closed"
    >
      <div class="tableBox">
        <TsxElementTable
          ref="tableRef"
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :table-columns="realTableColumns"
          :handle="{ show: true }"
          :table="{
            rowKey: 'id',
            data: detailList,
            loading: detailLoading,
            border: true,
            defaultExpandAll
          }"
          :pagination="{
            total: detailTotal
          }"
          @table-refresh="getFeedDetail"
          @page-change="getFeedDetail"
        >
          <template #handle-left>
            <div class="d-flex">
              <template v-if="platform === 'walmart'">
                <el-select
                  v-model="filterIngestionStatus"
                  placeholder="Feed ID 状态"
                  style="width: 200px; margin-right: var(--normal-padding)"
                  clearable
                  @change="getFeedDetail"
                >
                  <el-option label="SUCCESS" value="SUCCESS">SUCCESS</el-option>
                  <el-option label="TIMEOUT_ERROR" value="TIMEOUT_ERROR">TIMEOUT_ERROR</el-option>
                  <el-option label="DATA_ERROR" value="DATA_ERROR">DATA_ERROR</el-option>
                  <el-option label="SYSTEM_ERROR" value="SYSTEM_ERROR">SYSTEM_ERROR</el-option>
                </el-select>
                <el-input
                  v-model="filterSku"
                  placeholder="SKU"
                  style="width: 200px; margin-right: var(--normal-padding)"
                  @keydown.enter="getFeedDetail"
                />
              </template>
              <el-button @click="handleExpand">展开 / 折叠</el-button>
            </div>
          </template>
          <template #table-expand="{ row }">
            <template v-if="platform === 'walmart'">
              <template v-if="row.ingestion_status === 'SUCCESS'">
                <ViewJson :value="row.product_identifiers || {}" :expand-depth="5" />
              </template>
              <template v-else>
                <ViewJson :value="row.ingestion_errors || {}" :expand-depth="5" />
              </template>
            </template>
            <template v-else>
              <ViewJson :value="row.products" :expand-depth="10" />
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
import {
  WalmartFeedDetailProps,
  TiktokFeedDetailProps,
  GetDetailDto,
  getWalmartDetail,
  getTiktokDetail,
  IngestionStatus
} from '@/api/listing/index';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import TsxElementTable from 'tsx-element-table';
import { computed, ref, shallowRef, watch } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import ViewJson from 'vue-json-viewer';

interface ComponentProps {
  modelValue: boolean;
  feedId: string | null;
  platform: 'walmart' | 'tiktok';
}

const props = defineProps<ComponentProps>();
const emits = defineEmits(['update:modelValue', 'closed']);

const visible = useVModel(props, 'modelValue', emits);

const realTableColumns = computed(() => {
  return props.platform === 'walmart'
    ? config.walmartFeedDetailTableColumns
    : config.tiktokFeedDetailTableColumns;
});

const detailLoading = shallowRef(false);
const detailList = ref<WalmartFeedDetailProps[] | TiktokFeedDetailProps[]>([]);
const detailTotal = shallowRef(0);
const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const filterIngestionStatus = ref<IngestionStatus>();
const filterSku = ref<string>('');
const getFeedDetail = async () => {
  if (!props.feedId) return;
  try {
    detailLoading.value = true;
    const searchParams: GetDetailDto = {
      page: page.value,
      page_size: pageSize.value,
      feed_id: props.feedId,
      ingestion_status: filterIngestionStatus.value
    };
    if (filterSku.value) {
      searchParams.sku = filterSku.value;
    }
    const { data } = await (props.platform === 'walmart' ? getWalmartDetail : getTiktokDetail)(
      searchParams
    );
    if (props.platform === 'walmart') {
      detailList.value = data?.list || [];
    } else {
      detailList.value = ((data?.list || []) as TiktokFeedDetailProps[]).map(
        (item: TiktokFeedDetailProps) => {
          if (item.publish_result && item.publish_result.length > 0) {
            item.publish_result_first_children = item.publish_result[0];
          } else {
            item.publish_result_first_children = null;
          }
          return item;
        }
      );
    }
    detailTotal.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    detailLoading.value = false;
  }
};

const closed = () => {
  page.value = PAGE;
  pageSize.value = PAGE_SIZE;
  emits('closed');
};

// 展开 / 折叠
const defaultExpandAll = shallowRef(true);
const tableRef = shallowRef<TsxElementTable.ComponentInstance | null>(null);
const handleExpand = () => {
  defaultExpandAll.value = !defaultExpandAll.value;
  toggleRowExpansionAll(defaultExpandAll.value);
};
const toggleRowExpansionAll = (isExpansion: boolean) => {
  if (!tableRef.value) return;
  for (let i = 0; i < detailList.value.length; i++) {
    tableRef.value.getTableRef().toggleRowExpansion(detailList.value[i], isExpansion);
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
