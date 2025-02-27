<template>
  <div class="spiderBox cardBox">
    <div class="titleBox">
      <div class="title flex-center">爬虫看板</div>
      <el-button link type="primary" @click="toDetail">查看详情</el-button>
    </div>
    <div class="body">
      <SpiderEchart :table-data="tableData" :x-data="last7Days" :loading="false" />
    </div>
  </div>
</template>
<script setup lang="ts">
import SpiderEchart from './SpiderEchart.vue';
import moment from 'moment-timezone';
import { getSpiderList } from '@/api/spider/index';
import { ref, shallowRef, unref } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
// 获取当前日期
const today = moment();

// 初始化一个数组来存储日期
const last7Days = ref<string[]>([]);

// 循环生成最近 7 天的日期
for (let i = 0; i < 7; i++) {
  const date = today.clone().subtract(i, 'days'); // 从当前日期往前推 i 天
  last7Days.value.unshift(date.format('YYYY-MM-DD')); // 格式化日期并添加到数组
}

const toDetail = () => {
  router.push('/spider');
};

const tableData = shallowRef<number[]>([]);
const loading = shallowRef(true);
const getListFun = async () => {
  loading.value = true;
  try {
    const { data } = await getSpiderList({
      page: 1,
      page_size: 100,
      end_date: unref(last7Days)[unref(last7Days).length - 1],
      start_date: unref(last7Days)[0]
    });
    tableData.value = (data?.list || []).map((item) => item.req_200).reverse();
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};
getListFun();
</script>
<style lang="scss" scoped>
.spiderBox {
  & > .body {
    position: relative;
  }
}
</style>
