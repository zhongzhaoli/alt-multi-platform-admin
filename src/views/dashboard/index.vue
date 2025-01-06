<template>
  <div class="scrollContainer">
    <div v-loading="dashboardLoading" class="cardBox">
      <div class="header">
        <div class="title">
          <span>销量表现</span>
        </div>
        <div class="rightBox">
          <div class="datePicker" @click="openDatePicker">
            <el-date-picker
              ref="datePickerRef"
              v-model="dateRange"
              class="datePickerItem"
              type="daterange"
              @change="datePickerChange"
            />
            <div class="textValue flex-center">
              <el-icon><Calendar /></el-icon>
              <span>{{ dateRangeText }}</span>
            </div>
          </div>
          <div class="selectBox">
            <el-select
              v-model="granularity"
              size="small"
              placement="bottom"
              @change="getSalesData"
            >
              <template
                v-for="(item, _index) in granularityRange"
                :key="_index"
              >
                <el-option :value="item.value" :label="item.label">
                  {{ item.label }}
                </el-option>
              </template>
            </el-select>
          </div>
        </div>
      </div>
      <div class="bodyBox">
        <div class="countBox">
          <el-row :gutter="normalPadding">
            <el-col :span="6">
              <CountNumberCard
                :count="27430.15"
                count-prefix="$"
                title="商品销售额"
              />
            </el-col>
            <el-col :span="6">
              <CountNumberCard
                :count="29608.55"
                count-prefix="$"
                title="已支付金额"
              />
            </el-col>
            <el-col :span="6">
              <CountNumberCard :count="871" :decimals="0" title="已售出" />
            </el-col>
            <el-col :span="6">
              <CountNumberCard
                :count="779"
                :decimals="0"
                title="已支付订单数"
              />
            </el-col>
          </el-row>
        </div>
        <div class="chartsBox">
          <orderCharts :options="cloneOptions" />
        </div>
      </div>
    </div>
    <div class="cardBox">
      <div class="header">
        <div class="title">
          <span>SKU销量表现</span>
        </div>
      </div>
      <div class="bodyBox">
        <TsxElementTable
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :table-columns="config.tableColumns"
          :table="{
            data: tableData,
            border: true,
            loading,
          }"
          :pagination="{
            total,
          }"
          @page-change="getListFun"
        >
          <template #table-shop_name="{ row }">
            <TextEllipsis :text="row.shop_name" :line="2" />
          </template>
          <template #table-productInfo="{ row }">
            <ProductItem
              :image-url="row.product_image_url"
              :product-name="row.product_name"
              :desc-list="[{ text: row.sku, prefix: 'SKU' }]"
            />
          </template>
        </TsxElementTable>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from "vue";
import CountNumberCard from "./components/countNumberCard.vue";
import TsxElementTable from "tsx-element-table";
import orderCharts from "./components/orderCharts.vue";
import { getCssVariableValue } from "@/utils/css";
import { DatePickerInstance } from "element-plus";
import { Calendar } from "@element-plus/icons-vue";
import ProductItem from "@/components/ProductItem/index.vue";
import * as API_DASHBOARD from "@/api/dashboard";
import * as config from "./config";
import moment from "moment-timezone";
import { EChartsOption } from "echarts";
import { PAGE, PAGE_SIZE } from "@/constants/app";
import TextEllipsis from "@/components/TextEllipsis/index.vue";

let normalPadding: string | number = getCssVariableValue("--normal-padding");
normalPadding = parseFloat((normalPadding as string).replace("px", ""));

const granularity = ref("hour");
const datePickerRef = ref<DatePickerInstance | null>(null);
const dateRange = ref<[Date, Date]>([new Date(), new Date()]);
const dateRangeText = computed(() => {
  const [start, end] = dateRange.value;
  if (start.getTime() === end.getTime()) {
    return moment(start).format("YYYY-MM-DD");
  } else {
    return `${moment(start).format("YYYY-MM-DD")} / ${moment(end).format(
      "YYYY-MM-DD",
    )}`;
  }
});
const granularityRange = computed(() => {
  const [start, end] = dateRange.value;
  const diff = moment(end).diff(moment(start), "days") + 1;
  if (diff < 7 && diff >= 1) {
    return config.levelOneGranularity;
  } else if (diff < 360 && diff >= 7) {
    return config.levelTwoGranularity;
  } else {
    return config.levelThreeGranularity;
  }
});

const openDatePicker = () => {
  datePickerRef.value?.handleOpen();
};

const datePickerChange = () => {
  granularity.value = granularityRange.value[0].value;
  getSalesData();
};

const dashboardLoading = ref(false);
let cloneOptions: EChartsOption = {};
const getSalesData = async () => {
  dashboardLoading.value = true;
  try {
    const { data } = await API_DASHBOARD.getDashboardData({
      start_date: moment(dateRange.value[0]).format("YYYY-MM-DD"),
      end_date: moment(dateRange.value[1]).format("YYYY-MM-DD"),
      granularity: granularity.value,
    });
    cloneOptions = config.generateOptions(
      data?.date_range || [],
      data?.list || [],
      data?.history || [],
    );
  } catch (err) {
    console.log(err);
  } finally {
    dashboardLoading.value = false;
  }
};
getSalesData();

const loading = ref(false);
const tableData = ref<API_DASHBOARD.SkuDataProps[]>([]);
const total = ref(0);
const currentPage = ref(PAGE);
const pageSize = ref(PAGE_SIZE);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await API_DASHBOARD.getSkuData({
      page: currentPage.value,
      page_size: pageSize.value,
    });
    tableData.value = data?.list || [];
    total.value = data?.total || 0;
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
getListFun();
</script>
<style lang="scss" scoped>
.scrollContainer {
  & > .cardBox {
    background-color: #fff;
    border-radius: 4px;
    padding: 16px;
    &:not(:last-child) {
      margin-bottom: 16px;
    }
    & > .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      & > .title {
        font-size: 15px;
        font-weight: 500;
        color: #333;
      }
      & > .rightBox {
        font-size: 14px;
        color: #666;
        display: flex;
        align-items: center;
        & > .datePicker {
          min-width: 100px;
          height: 24px;
          text-align: center;
          box-shadow: 0 0 0 1px var(--el-border-color) inset;
          border-radius: var(--el-border-radius-base);
          margin-right: 16px;
          cursor: pointer;
          position: relative;
          font-size: 12px;
          transform: translateZ(0);
          transition: var(--el-transition-duration);
          box-sizing: border-box;
          &:hover {
            box-shadow: 0 0 0 1px var(--el-border-color-hover) inset;
          }
          &:deep(.datePickerItem) {
            position: absolute;
            min-width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            height: 100%;
            opacity: 0;
            top: 0;
            left: 0;
            z-index: 0;
          }
          & > .textValue {
            cursor: pointer;
            z-index: 1;
            position: relative;
            height: 100%;
            padding: 0 10px;
            & > span {
              margin-left: 6px;
            }
          }
        }
        & > .selectBox {
          width: 60px;
        }
      }
    }
    & > .bodyBox {
      margin-top: 16px;
      & > .chartsBox {
        margin-top: 32px;
        width: 100%;
        height: 300px;
      }
    }
  }
}
</style>
