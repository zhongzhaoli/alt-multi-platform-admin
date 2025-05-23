<template>
  <div class="container">
    <div class="filterBox">
      <FilterContainer
        v-model="filterValue"
        :columns="config.filterColumns"
        @submit="getListFun"
        @reset="getListFun"
      />
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
          <el-button type="primary" @click="addStore">新增店铺</el-button>
        </template>
        <template #table-app_key="{ row }">
          <div class="textBox">
            <RenderCopyIcon title="App Key" :text="row.app_key" margin="r" />
            <TextEllipsis :text="row.app_key" />
          </div>
        </template>
        <template #table-app_secret="{ row }">
          <div class="textBox">
            <RenderCopyIcon title="App Secret" :text="row.app_secret" margin="r" />
            <TextEllipsis :text="row.app_secret" />
          </div>
        </template>
        <template #table-pause="{ row }">
          <SwitchHandle
            v-model="row.pause"
            status-key="pause"
            :inactive-value="0"
            :active-value="1"
            p-id="id"
            :extra-data="row"
            :api="API_TIKTOK.editPauseStore"
          />
        </template>
        <template #table-available="{ row }">
          <div v-permission="{ value: 'system:tiktokStore:avaliable', type: 'some' }">
            <el-radio-group
              v-model="row.available"
              v-loading="row.loading"
              size="small"
              @change="changeAvailable(row)"
            >
              <el-radio-button label="存活" :value="1" />
              <el-radio-button label="死亡" :value="0" />
            </el-radio-group>
          </div>
          <div v-permission="{ value: 'system:tiktokStore:avaliable', type: 'noSome' }">
            <el-tag v-if="row.available" type="success" disable-transitions>存活</el-tag>
            <el-tag v-else type="danger" disable-transitions>死亡</el-tag>
          </div>
        </template>
        <template #table-handle="{ row }">
          <el-button type="primary" link @click="editDialog(row)"> 编辑 </el-button>
        </template>
      </TsxElementTable>
    </div>
    <ConfirmDialog
      v-model="dialogVisible"
      width="400px"
      :title="dialogTitle"
      :submit-loading="submitLoading"
      @closed="dialogClosed"
      @submit="submitFun"
    >
      <el-form ref="editFormRef" :rules="rules" :model="editFormValues" label-position="top">
        <el-form-item prop="shop_id" label="店铺ID：">
          <el-input
            v-model="editFormValues.shop_id"
            :disabled="editFormValues.hasOwnProperty('id')"
            placeholder="请输入店铺ID"
          />
        </el-form-item>
        <el-form-item prop="shop_name" label="店铺名称：">
          <el-input v-model="editFormValues.shop_name" placeholder="请输入店铺名称" />
        </el-form-item>
        <el-form-item prop="client_id" label="App Key：">
          <el-input v-model="editFormValues.app_key" placeholder="请输入 App Key" />
        </el-form-item>
        <el-form-item prop="clientSecret" label="App Secret：">
          <el-input
            v-model="editFormValues.app_secret"
            class="clientSecretInput"
            type="textarea"
            :rows="3"
            placeholder="请输入 App Secret"
          />
        </el-form-item>
        <el-form-item prop="listing_min_price" required label="价格区间：">
          <div class="inputNumberBox d-flex align-center">
            <el-input-number
              v-model="editFormValues.listing_min_price"
              style="width: 100%"
              :precision="0"
              :min="1"
              :controls="false"
              placeholder="最小值"
            />
            <div class="interval">~</div>
            <el-input-number
              v-model="editFormValues.listing_max_price"
              style="width: 100%"
              :precision="0"
              :min="1"
              :controls="false"
              placeholder="最大值"
            />
          </div>
        </el-form-item>
      </el-form>
    </ConfirmDialog>
    <ConfirmDialog
      v-model="addStoreVisible"
      title="新增店铺"
      width="400px"
      @submit="addStoreFun"
      @closed="closedStoreVisible"
    >
      <el-input v-model="addStoreUrl" type="textarea" :rows="4" placeholder="请输入授权链接" />
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import TsxElementTable from 'tsx-element-table';
import * as config from './config';
import { ref, shallowRef, unref } from 'vue';
import { PAGE, PAGE_SIZE } from '@/constants/app';
import * as API_TIKTOK from '@/api/system/tiktokStore';
import TextEllipsis from '@/components/TextEllipsis/index.vue';
import { RenderCopyIcon } from '@/utils';
import { useMessageBox } from '@/hooks/useMessageBox';
import { FormInstance } from 'element-plus';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import { cloneDeep } from 'lodash-es';
import SwitchHandle from '@/components/SwitchHandle/index.vue';
import FilterContainer from '@/components/FilterContainer/index.vue';
import moment from 'moment-timezone';
import { ElMessage } from 'element-plus';

const filterValue = ref<Partial<config.FilterDto>>({});
const currentPage = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const total = shallowRef(0);
const loading = shallowRef(false);
const tableData = shallowRef<API_TIKTOK.StoreProps[]>([]);

const validatorPrice = (_rule: any, _value: any, callback: any) => {
  if (editFormValues.value.listing_min_price && editFormValues.value.listing_max_price) {
    if (editFormValues.value.listing_min_price > editFormValues.value.listing_max_price) {
      callback(new Error('最小值不能大于最大值'));
    } else if (editFormValues.value.listing_min_price === editFormValues.value.listing_max_price) {
      callback(new Error('最小值不能等于最大值'));
    } else {
      callback();
    }
  } else {
    callback(new Error('请输入价格区间'));
  }
};
const rules = {
  ...config.editFormRules,
  listing_min_price: [{ validator: validatorPrice, trigger: 'blur' }]
};
const getListFun = async () => {
  if (loading.value) return;
  loading.value = true;
  try {
    const { data } = await API_TIKTOK.getStoreList({
      page: currentPage.value,
      page_size: pageSize.value,
      ...unref(filterValue)
    });
    tableData.value = (data?.list || []).map((item) => ({
      ...item,
      created_at: moment(item.created_at).format('YYYY-MM-DD HH:mm:ss')
    }));
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
// 新增和编辑店铺
const editFormRef = shallowRef<FormInstance>();
const dialogTitle = shallowRef('新增店铺');
const dialogVisible = shallowRef(false);
const submitLoading = shallowRef(false);
const editFormValues = ref<Partial<API_TIKTOK.StoreProps>>({});
const editDialog = (row: API_TIKTOK.StoreProps) => {
  editFormValues.value = cloneDeep(row);
  dialogTitle.value = '编辑店铺';
  dialogVisible.value = true;
};
const dialogClosed = () => {
  editFormValues.value = {};
  editFormRef.value?.resetFields();
};

const addStoreVisible = shallowRef(false);
const addStoreUrl = ref('');
const closedStoreVisible = () => {
  addStoreUrl.value = '';
};
const addStore = () => {
  addStoreVisible.value = true;
};
const addStoreFun = () => {
  useMessageBox('确认添加Tiktok店铺？', async () => {
    try {
      const params: API_TIKTOK.CreateStoreDto = {
        url: addStoreUrl.value
      };
      await API_TIKTOK.createStore(params);
      ElMessage.success('添加成功');
      addStoreVisible.value = false;
      getListFun();
    } catch (err) {
      console.log(err);
    }
  });
};
const changeAvailable = async (row: API_TIKTOK.StoreProps) => {
  row.loading = true;
  try {
    await API_TIKTOK.editStore(row as API_TIKTOK.EditStoreDto);
    ElMessage.success('编辑成功');
  } catch (err) {
    console.log(err);
  } finally {
    row.loading = false;
  }
};

const submitFun = () => {
  editFormRef.value?.validate(async (valid) => {
    if (!valid) {
      return;
    }
    useMessageBox('确认提交？', async () => {
      try {
        const params: any = {
          shop_id: editFormValues.value.shop_id,
          app_key: editFormValues.value.app_key,
          app_secret: editFormValues.value.app_secret,
          shop_name: editFormValues.value.shop_name,
          listing_min_price: editFormValues.value.listing_min_price,
          listing_max_price: editFormValues.value.listing_max_price
        };
        if (editFormValues.value.hasOwnProperty('id')) {
          // 编辑
          params.id = editFormValues.value.id;
          params.pause = editFormValues.value.pause;
          params.available = editFormValues.value.available;
          await API_TIKTOK.editStore(params as API_TIKTOK.EditStoreDto);
          ElMessage.success('编辑成功');
        } else {
          // 新增
          ElMessage.warning('新增店铺功能暂未开放');
        }
        dialogVisible.value = false;
        getListFun();
      } catch (err) {
        console.log(err);
      }
    });
  });
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
