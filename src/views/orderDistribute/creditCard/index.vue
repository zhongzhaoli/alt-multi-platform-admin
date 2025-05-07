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
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :table-columns="config.tableColumns"
        :table="{ data: tableData, loading, border: true }"
        :handle="{
          show: false
        }"
        :pagination="{ total }"
        @page-change="getListFun"
        @table-refresh="getListFun"
      >
        <template #table-two_step_image="{ row }">
          <template v-if="row.two_step">
            <div class="imageLoadBox">
              <ImageLoad :token="true" :src="row.two_step" />
            </div>
          </template>
          <template v-else>-</template>
        </template>
        <template #table-action="{ row }">
          <template v-if="row.card_status === CardStatus.存活">
            <el-button
              v-permission="{ type: 'some', value: 'order:creditCard:twoStepVerify' }"
              link
              type="primary"
              @click="twoStepHander(row)"
            >
              二步验证
            </el-button>
            <div v-permission="{ type: 'noSome', value: 'order:creditCard:twoStepVerify' }">-</div>
          </template>
          <template v-else>-</template>
        </template>
      </TsxElementTable>
    </div>
    <ConfirmDialog
      v-model="twoStepVisible"
      :submit-loading="submitLoading"
      title="二步验证"
      width="500px"
      top="100px"
      @submit="submitFun"
    >
      <el-form label-position="left" label-width="140px">
        <el-form-item label="验证Token：" required>
          <el-input v-model="formValue.two_step_token" placeholder="请输入二步验证Token" />
        </el-form-item>
        <el-form-item label="亚马逊手机号：" required>
          <el-input v-model="formValue.card_phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="验证图片：" required>
          <div class="imageUploadBox">
            <ImageUpload :default-image="defaultImage" @success="imgHander" />
          </div>
        </el-form-item>
      </el-form>
    </ConfirmDialog>
  </div>
</template>
<script setup lang="ts">
import { PAGE, PAGE_SIZE } from '@/constants/app';
import * as config from './config';
import TsxElementTable from 'tsx-element-table';
import FilterContainer from '@/components/FilterContainer/index.vue';
import ConfirmDialog from '@/components/ConfirmDialog/index.vue';
import ImageUpload from './components/ImageUpload.vue';
import ImageLoad from '@/components/ImageLoad/index.vue';
import { ref, shallowRef, unref } from 'vue';
import { getCardInfo, CardInfoProps, CardStatus } from '@/api/orderDistribute/purchase';
import {
  SaveTwoStepDto,
  saveCreditCardTwoStep,
  twoStepImageUrl
} from '@/api/orderDistribute/creditCard';
import { ElMessage } from 'element-plus';
import moment from 'moment-timezone';

defineOptions({
  name: 'OrderDistributeCreditCard'
});

const page = shallowRef(PAGE);
const pageSize = shallowRef(PAGE_SIZE);
const tableData = ref<CardInfoProps[]>([]);
const total = shallowRef(0);
const loading = shallowRef(false);
const filterValue = ref<Partial<config.FilterDto>>({});
const submitLoading = shallowRef(false);

const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getCardInfo({
      page: page.value,
      page_size: pageSize.value,
      ...filterValue.value
    });
    total.value = data?.total || 0;
    tableData.value = (data?.list || []).map((item) => {
      return {
        ...item,
        two_step: item.two_step ? twoStepImageUrl(item.two_step) : '',
        origin_two_step: item.two_step,
        last_operated_time: item.last_operated_time
          ? moment(item.last_operated_time).format('YYYY-MM-DD HH:mm:ss')
          : '-'
      };
    });
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

const twoStepVisible = shallowRef(false);
const tempCardInfo = shallowRef<CardInfoProps | null>(null);
const defaultImage = shallowRef('');
const formValue = ref<SaveTwoStepDto>({
  two_step_token: undefined,
  two_step_img: undefined,
  card_number: '',
  card_phone: ''
});
const twoStepHander = (row: CardInfoProps) => {
  tempCardInfo.value = row;
  formValue.value.two_step_token = row.two_step_token;
  formValue.value.card_phone = row.card_phone;
  formValue.value.two_step_img = row.origin_two_step;
  defaultImage.value = row.origin_two_step;
  twoStepVisible.value = true;
};

const imgHander = (file: File) => {
  formValue.value.two_step_img = file;
};

const submitFun = async () => {
  if (!unref(formValue).two_step_token && !unref(formValue).two_step_img) {
    ElMessage.error('请输入二步验证Token或上传验证图片');
    return;
  }
  if (!unref(formValue).card_phone) {
    ElMessage.error('请输入亚马逊手机号');
    return;
  }
  submitLoading.value = true;
  try {
    formValue.value.card_number = unref(tempCardInfo)?.card_number || '';
    const formData = new FormData();
    Object.entries(unref(formValue)).forEach(([key, value]) => {
      if (key === 'two_step_img') {
        if (typeof value !== 'string') {
          formData.append(key, value as Blob);
        }
      } else {
        formData.append(key, value as string | Blob);
      }
    });
    await saveCreditCardTwoStep(formData);
    ElMessage.success('二步验证成功');
    twoStepVisible.value = false;
    getListFun();
  } catch (err) {
    console.log(err);
  } finally {
    submitLoading.value = false;
  }
};

getListFun();
</script>
<style lang="scss" scoped>
.container {
  & > .tableBox {
    .imageLoadBox {
      display: flex;
      justify-content: center;
    }
  }
  & .imageUploadBox {
    width: 130px;
    height: 130px;
  }
}
</style>
