import { LoginDto, login as loginApi } from "@/api/user/login";
import { getUserInfo as getUserInfoApi } from "@/api/user/user";
import { defineStore } from "pinia";
import { ref } from "vue";
import { piniaPersistConfig } from "@/utils/persist";
import { resetRouter } from "@/router/helper";
import { useTagsViewStore } from "./tagsView";

export interface UserInfo {
  user_id: string;
  username: string;
  role_id: string;
  role_name: string;
  permissions: Array<string>;
}

export interface UserState {
  token: string;
  userInfo: UserInfo;
}

type UserStateKey = Array<keyof UserState>;

export const useUserStore = defineStore(
  "user",
  () => {
    // token
    const token = ref<string>();
    // 用户信息
    const userInfo = ref<UserInfo>();
    // 设置用户信息
    const setUserInfo = (val: UserInfo) => {
      userInfo.value = val;
    };
    //登录
    const login = async (payload: LoginDto) => {
      try {
        const { data } = await loginApi(payload);
        token.value = data;
        return data;
      } catch (err) {
        console.log("授权失败");
        return Promise.reject(err);
      }
    };
    // 退出登录
    const logout = () => {
      const tagsViewStore = useTagsViewStore();
      token.value = "";
      userInfo.value = undefined;
      resetRouter();
      tagsViewStore.delAllVisitedView();
      tagsViewStore.delAllCachedView();
    };
    // 获取用户信息
    const getUserInfo = async () => {
      try {
        const { data } = await getUserInfoApi();
        setUserInfo(data as UserInfo);
        return data;
      } catch (_err) {
        console.log("授权失败");
      }
    };
    return {
      token,
      userInfo,
      setUserInfo,
      login,
      logout,
      getUserInfo,
    };
  },
  {
    persist: piniaPersistConfig<UserStateKey>("USER_STORE", ["token"]),
  },
);
