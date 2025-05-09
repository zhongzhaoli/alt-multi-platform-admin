<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      >
        <template #shop_id="{ form, row }">
          <SelectTiktokStore v-model="form[row.prop]" multiple @change="getListFun" />
        </template>
      </FilterContainer>
    </div>
    <div class="tableBox">
      <TsxElementTable
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        v-loading="loading"
        :table-columns="config.tableColumns"
        :table="{
          data: tableData,
          border: true
        }"
        :handle="{
          show: true
        }"
        :pagination="{
          total
        }"
        @page-change="getListFun"
        @table-refresh="getListFun"
      >
        <template #handle-left>
          <span class="frequencyText">更新频率：每天 06:00</span>
        </template>
        <template #table-handle="{ row }">
          <el-button type="primary" link @click="scoreDialog(row)">健康评分</el-button>
        </template>
      </TsxElementTable>
    </div>
    <el-drawer
      v-model="scoreDialogVisible"
      title="健康评分"
      size="800px"
      header-class="hidden"
      @closed="drawerClosed"
    >
      <template v-if="tempStoreValues">
        <div
          v-if="tempStoreValues.score !== null && tempStoreValues !== undefined"
          class="scoreBox"
        >
          <div class="scoreTitle">
            <div>{{ tempStoreValues.status }}</div>
            <div v-if="tempStoreValues.available_1 === 0" class="avaliable">
              <el-icon><CircleCloseFilled /></el-icon>
              <span class="text">店铺已停用</span>
            </div>
          </div>
          <div class="currentScore">
            <div
              :style="{
                left: `calc(${(tempStoreValues.score / 1000) * 100}% - 15px)`
              }"
            >
              {{ tempStoreValues.score }}
              <i class="ri-arrow-down-s-fill" />
            </div>
          </div>
          <div class="scoreProgress">
            <div class="scale" />
            <div class="scale" />
            <div class="scale" />
            <div class="scale" />
            <el-progress
              :percentage="tempStoreValues.score / 10"
              color="#f0a82c"
              stroke-linecap="square"
              :show-text="false"
            />
          </div>
          <div class="scoreScaleTextBox">
            <div>0</div>
            <div>50</div>
            <div>100</div>
            <div>150</div>
            <div>200</div>
            <div>1000</div>
          </div>
          <div class="assembleBox">
            <div>差</div>
            <div>优秀</div>
          </div>
        </div>
        <div
          class="otherMessageBox"
          :class="{
            pt: !tempStoreValues.score,
            maxHeight: !(tempStoreValues.score !== null && tempStoreValues !== undefined)
          }"
        >
          <el-tabs v-model="activeName" class="tabsBox" @tab-click="handleClick">
            <el-tab-pane label="违规记录" name="violations">
              <div class="tableBox">
                <el-table
                  v-loading="scoreTableLoading"
                  :data="violationsTableData"
                  border
                  style="height: 100%"
                >
                  <el-table-column label="违规原因" width="200px">
                    <template #default="{ row }">
                      <TextEllipsis :text="row.violation_reason" :line="1" />
                      <div class="d-flex align-center w-100">
                        <RenderCopyIcon
                          :text="row.violation_id"
                          margin="r"
                          title="编号"
                          type="info"
                        />
                        <span class="copyText">
                          <TextEllipsis :text="row.violation_id" :line="1" />
                        </span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="violation_details" label="处罚" />
                  <el-table-column label="日期">
                    <template #default="{ row }">
                      <div>{{ row.violation_date }}</div>
                      <div>{{ row.violation_time }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="申诉状态" width="120px" align="center">
                    <template #default="{ row }">
                      <div class="appealStatus">{{ row.violation_appeal_status }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" width="120px" align="center">
                    <template #default="{ row }">
                      <el-tag type="danger" disable-transitions>{{ row.violation_status }}</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="paginationBox">
                <el-pagination
                  v-model="scorePage"
                  background
                  layout="total, prev, pager, next"
                  :total="violotionsTotal"
                  @change="getViolationsList"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane label="警告记录" name="warnings">
              <div class="tableBox">
                <el-table
                  v-loading="scoreTableLoading"
                  :data="warningsTableData"
                  border
                  height="100%"
                  style="height: 100%"
                >
                  <el-table-column label="警告原因">
                    <template #default="{ row }">
                      <TextEllipsis :text="row.warning_reason" :line="1" />
                      <div class="d-flex align-center w-100">
                        <RenderCopyIcon
                          :text="row.warning_id"
                          margin="r"
                          title="编号"
                          type="info"
                        />
                        <span class="copyText">
                          <TextEllipsis :text="row.warning_id" :line="1" />
                        </span>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="警告日期">
                    <template #default="{ row }">
                      <div>{{ row.warning_date }}</div>
                      <div>{{ row.warning_time }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态" width="100px" align="center">
                    <template #default="{ row }">
                      <el-tag type="warning" disable-transitions>{{ row.warning_status }}</el-tag>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="paginationBox">
                <el-pagination
                  v-model:current-page="scorePage"
                  background
                  layout="total, prev, pager, next"
                  :total="warningsTotal"
                  @change="getWarningsList"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </template>
    </el-drawer>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import * as config from './config';
import { ref, shallowRef, unref } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import * as API_TIKTOK from '@/api/performance/tiktok';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import { RenderCopyIcon } from '@/utils';
import FilterContainer from '@/components/FilterContainer/index.vue';
import SelectTiktokStore from '@/components/SelectTiktokStore/index.vue';
import moment from 'moment-timezone';
import { CircleCloseFilled } from '@element-plus/icons-vue';
import {
  getViolationsList,
  getWarningsList,
  ViolationProps,
  WarningsProps
} from '@/api/system/tiktokStore';

const filterValue = ref<Partial<config.FilterDto>>({});
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const loading = shallowRef(false);
const tableData = shallowRef<API_TIKTOK.TiktokHealthProps[]>([]);

const getListFun = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const { data } = await API_TIKTOK.getHealthList({
      page: currentPage.value,
      page_size: pageSize.value,
      ...unref(filterValue)
    });
    tableData.value = data?.list || [];
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

// 健康评分
const scoreDialogVisible = shallowRef(false);
const tempStoreValues = ref<API_TIKTOK.TiktokHealthProps>();
const activeName = shallowRef<'violations' | 'warnings'>('violations');
const scoreTableLoading = shallowRef(false);
const violationsTableData = shallowRef<ViolationProps[]>([]);
const violotionsTotal = shallowRef(0);
const warningsTotal = shallowRef(0);
const scorePage = shallowRef(PAGE);
const scoreDialog = (row: API_TIKTOK.TiktokHealthProps) => {
  tempStoreValues.value = row;
  scoreDialogVisible.value = true;
  getViolationsListFun();
};
const getViolationsListFun = async () => {
  if (!tempStoreValues.value) return;
  scoreTableLoading.value = true;
  try {
    const { data } = await getViolationsList({
      shop_id: tempStoreValues.value!.shop_id,
      page: scorePage.value,
      page_size: PAGE_SIZE
    });
    violotionsTotal.value = data?.total || 0;
    violationsTableData.value = (data?.list || []).map((item) => ({
      ...item,
      violation_date: moment(item.violation_datetime).format('YYYY/MM/DD'),
      violation_time: moment(item.violation_datetime).format('HH:mm:ss')
    }));
  } catch (err) {
    console.log(err);
  } finally {
    scoreTableLoading.value = false;
  }
};
const warningsTableData = shallowRef<WarningsProps[]>([]);
const getWarningsListFun = async () => {
  console.log(scorePage.value);
  if (!tempStoreValues.value) return;
  scoreTableLoading.value = true;
  try {
    const { data } = await getWarningsList({
      shop_id: tempStoreValues.value!.shop_id,
      page: scorePage.value,
      page_size: PAGE_SIZE
    });
    warningsTotal.value = data?.total || 0;
    warningsTableData.value = (data?.list || []).map((item) => ({
      ...item,
      warning_date: moment(item.warning_datetime).format('YYYY/MM/DD'),
      warning_time: moment(item.warning_datetime).format('HH:mm:ss')
    }));
  } catch (err) {
    console.log(err);
  } finally {
    scoreTableLoading.value = false;
  }
};
const drawerClosed = () => {
  tempStoreValues.value = undefined;
  violationsTableData.value = [];
  warningsTableData.value = [];
  warningsTotal.value = 0;
  violotionsTotal.value = 0;
  activeName.value = 'violations';
};

const handleClick = (tab: any) => {
  activeName.value = tab.name;
  if (activeName.value === 'violations') {
    getViolationsListFun();
  } else {
    getWarningsListFun();
  }
};

getListFun();
</script>
<style lang="scss" scoped>
@use '@/styles/mixins.scss' as *;
.container {
  & > .tableBox {
    & .textBox {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      & > .copyIcon {
        display: inline-block;
        margin-right: 5px;
        cursor: pointer;
        transition: color 0.2s;
        &:hover {
          color: var(--el-color-primary);
        }
      }
    }
  }
  & .inputNumberBox {
    width: 100%;
    &:deep(input) {
      text-align: left;
    }
    & > .interval {
      width: 100px;
      text-align: center;
    }
  }
  &:deep(.el-drawer__body) {
    padding: 0;
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }
  &:deep(.el-drawer__header) {
    display: none;
  }
  & .scoreBox {
    position: relative;
    background: linear-gradient(to bottom, #fff3df, #ffffff);
    padding: 20px;
    flex: 0 0 auto;
    & > .scoreTitle {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      & > .avaliable {
        display: flex;
        align-items: center;
        color: red;
        & > span {
          padding-left: 6px;
        }
      }
    }
    & > .currentScore {
      width: 100%;
      position: relative;
      height: 30px;
      & > div {
        width: 30px;
        font-size: 13px;
        line-height: 16px;
        height: 100%;
        text-align: center;
        position: absolute;
        font-weight: bold;
        & > i {
          font-size: 20px;
          position: relative;
          top: -2px;
        }
      }
    }
    & > .scoreProgress {
      position: relative;
      & > .scale {
        width: 1px;
        background-color: #fff;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 999;
        &:first-child {
          left: calc(5% - 0.5px);
        }
        &:nth-child(2) {
          left: calc(10% - 0.5px);
        }
        &:nth-child(2) {
          left: calc(10% - 0.5px);
        }
        &:nth-child(3) {
          left: calc(15% - 0.5px);
        }
        &:nth-child(4) {
          left: calc(20% - 0.5px);
        }
      }
      &:deep(.el-progress-bar__inner) {
        border-radius: 2px;
      }
      &:deep(.el-progress-bar__outer) {
        background-color: #efefef;
      }
    }
    & > .scoreScaleTextBox {
      position: relative;
      margin-top: 4px;
      height: 20px;
      & > div {
        position: absolute;
        width: 24px;
        height: 20px;
        line-height: 20px;
        color: #666;
        font-size: 12px;
        text-align: center;
      }
      & > div:nth-child(1) {
        left: 0;
        text-align: left;
      }
      & > div:nth-child(2) {
        left: calc(5% - 12px);
      }
      & > div:nth-child(3) {
        left: calc(10% - 12px);
      }
      & > div:nth-child(4) {
        left: calc(15% - 12px);
      }
      & > div:nth-child(5) {
        left: calc(20% - 12px);
      }
      & > div:last-child {
        width: fit-content;
        right: 0;
      }
    }
    & > .assembleBox {
      font-size: 12px;
      display: flex;
      color: #666;
      justify-content: space-between;
    }
  }
  & .otherMessageBox {
    padding: 0 20px 20px 20px;
    height: calc(100vh - 155px);
    &.maxHeight {
      height: 100%;
    }
    &.pt {
      padding-top: 20px;
    }
    & > .tabsBox {
      height: 100%;
      &:deep(.el-tab-pane) {
        height: 100%;
      }
    }
    & .tableBox {
      height: calc(100% - 32px - 20px);
      margin-bottom: 20px;
      & .copyText {
        color: #c6c6c6;
        font-size: 12px;
        width: 100%;
      }
      & .appealStatus {
        color: #c6c6c6;
        font-size: 13px;
        margin-top: 4px;
      }
    }
    & .paginationBox {
      height: 32px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
