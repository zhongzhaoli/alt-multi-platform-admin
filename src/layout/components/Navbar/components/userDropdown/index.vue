<template>
  <el-dropdown trigger="hover" @command="handleCommand">
    <div class="userDropdownContainer navbarWidgetItem">
      <div class="userInfo">
        <span class="department">{{ userInfo?.role_name || '无角色' }}</span>
        <span class="name">{{ userInfo?.username || '' }}</span>
      </div>
      <el-avatar class="avatar" shape="square" :size="32" :src="logo" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="updatePassword"> 修改密码 </el-dropdown-item>
        <el-dropdown-item command="logout"> 退出登录 </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <ChangePassword ref="changePasswrd" />
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUserStore } from '@/store/modules/user';
import { useRouter } from 'vue-router';
import { logout as logoutApi } from '@/api/user/login';
import { ElMessage } from 'element-plus';
import logo from '@/assets/avatar.jpg';
import ChangePassword, { type ChangePasswordInstance } from './components/changePassword.vue';

const userStore = useUserStore();
const routerStore = useRouter();

const userInfo = computed(() => userStore.userInfo);
const changePasswrd = ref<ChangePasswordInstance | null>(null);

const handleCommand = async (command: string | number | object) => {
  if (command === 'logout') {
    if (userInfo.value) {
      await logoutApi({ user_id: userInfo.value.user_id });
    }
    setTimeout(() => {
      userStore.logout();
      routerStore.push('/login');
      ElMessage.success('退出成功');
    }, 0);
  }
  if (command === 'updatePassword') if (changePasswrd.value) changePasswrd.value.openDialog();
};
</script>
<style lang="scss" scoped>
.userDropdownContainer {
  box-sizing: border-box;
  width: unset;
  padding: 0 8px;
  & > .avatar {
    border: 1px #f1f1f1 solid;
  }
  & > .userInfo {
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    align-items: flex-end;
    font-size: 12px;
    & > .department {
      color: #999;
      font-weight: 500;
    }
    & > .name {
      color: #111;
      margin-top: 4px;
      font-weight: 500;
    }
  }
}
</style>
