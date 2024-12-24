<template>
  <div class="errorPage flex-center">
    <img class="img" src="@/assets/404.png" />
    <div class="code">404</div>
    <div class="desc">抱歉，您访问的页面不存在。</div>
    <el-button class="btn" @click="toHome"> 返回首页 </el-button>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();

const toHome = () => {
  router.push('/');
};
</script>
<style lang="scss" scoped>
.errorPage {
  width: 100%;
  flex-direction: column;
  justify-content: unset;
  & > .img {
    margin-top: 20px;
    width: 50%;
  }
  & > .code {
    font-size: 24px;
    margin-top: 20px;
    margin-bottom: 8px;
    letter-spacing: 2px;
  }
  & > .desc {
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    text-align: center;
  }
  & > .btn {
    margin-top: 20px;
  }
}
</style>
