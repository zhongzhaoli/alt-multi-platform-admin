import { defineStore } from "pinia";
import {
  type ShippingProviderProps,
  getShippingProviders,
} from "@/api/tiktok/logistics";
import { ref } from "vue";

export interface AppState {
  shippingProvider: ShippingProviderProps[];
}

export const useTiktokStore = defineStore("tiktok", () => {
  const shippingProvider = ref<ShippingProviderProps[]>([]);

  const getShippingProvidersList = async () => {
    try {
      const { datas } = await getShippingProviders();
      shippingProvider.value = datas || [];
    } catch (err) {
      console.log(err);
    }
  };

  return {
    shippingProvider,
    getShippingProvidersList,
  };
});
