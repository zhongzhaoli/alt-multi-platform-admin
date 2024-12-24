<template>
  <div class="container">
    <div class="opacityBox" />
    <div class="loginBox">
      <div class="bgBox">
        <img src="@/assets/login_bg.png" alt="" />
      </div>
      <div class="rightBox">
        <div class="logo">
          <el-image class="logoItem" :src="logo" />
        </div>
        <div class="formBox">
          <el-form>
            <el-form-item>
              <el-input
                v-model="loginPayload.user_name"
                placeholder="请输入用户名"
                @keydown.enter="loginHandle"
              />
            </el-form-item>
            <el-form-item>
              <el-input
                v-model="loginPayload.user_passwd"
                show-password
                type="password"
                placeholder="请输入密码"
                @keydown.enter="loginHandle"
              />
              <div class="checkBox">
                <el-checkbox v-model="remember">
                  <span class="remember">记住我</span>
                </el-checkbox>
              </div>
            </el-form-item>
            <el-form-item>
              <el-button
                class="w-100"
                type="primary"
                auto-insert-space
                :loading="loading"
                @click="loginHandle"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="copyright">
          Copyright © 2024-2026 ALT tech All Right Reserved.
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import logo from '@/assets/logo.png';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';
import { ElNotification } from 'element-plus';
import { nowTimePeriod, timePeriodZh } from '@/utils/index';
import { SAVED_USER_KEY } from '@/constants/app';
const userStore = useUserStore();
const router = useRouter();
interface LoginDto {
  user_name: string;
  user_passwd: string;
}

// 按钮loading
const loading = ref<boolean>(false);
// 登录信息载核
const loginPayload = reactive<LoginDto>({
  user_name: '',
  user_passwd: '',
});
const remember = ref<boolean>(false);

// 登录操作
const loginHandle = async () => {
  // TODO：做一些数据校验
  loading.value = true;
  try {
    await userStore.login(loginPayload);
    ElNotification({
      title: '登录成功',
      offset: 45,
      message: `${timePeriodZh[nowTimePeriod()]}，欢迎回来`,
      type: 'success',
    });
    if (remember.value) {
      localStorage.setItem(SAVED_USER_KEY, JSON.stringify(loginPayload));
    }
    router.push('/');
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  const savedUser = localStorage.getItem(SAVED_USER_KEY);
  if (savedUser) {
    const user = JSON.parse(savedUser);
    loginPayload.user_name = user.user_name;
    loginPayload.user_passwd = user.user_passwd;
    remember.value = true;
  }
});
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url('/src/assets/bg.jpg');
  background-size: cover;
  position: relative;
  & > .opacityBox {
    background-color: rgba(255, 255, 255, 0.8);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  & > .loginBox {
    & {
      width: 850px;
      height: 500px;
      border-radius: 10px;
      box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.05);
      display: flex;
      overflow: hidden;
      background-color: #fff;
      z-index: 3;
    }
    @media screen and (max-width: 768px) {
      & {
        width: 400px;
      }
      .bgBox {
        display: none;
      }
      .rightBox {
        width: 100% !important;
      }
    }
    & > .bgBox {
      width: 500px;
      height: 500px;
      background-color: #fbfbfb;
      & > img {
        width: 100%;
        height: 100%;
        vertical-align: bottom;
      }
    }
    & > .rightBox {
      width: 350px;
      height: 500px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: -30px;
      position: relative;
      & > .logo {
        width: 200px;
        height: 115px;
        & > .logoItem {
          width: 100%;
          height: 100%;
        }
      }
      & > .formBox {
        margin-top: 40px;
        width: 250px;
        & .checkBox {
          margin-top: 10px;
          & .remember {
            color: #626262;
            font-size: 12px;
            line-height: 14px;
          }
        }
      }
      & > .copyright {
        font-size: 12px;
        color: #cecece;
        position: absolute;
        bottom: 20px;
        width: 100%;
        text-align: center;
        left: 0;
        transform: scale(0.8);
      }
    }
  }
}
</style>
