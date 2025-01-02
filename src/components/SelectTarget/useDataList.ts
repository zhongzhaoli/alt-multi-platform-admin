import { PAGE } from "@/constants/app";
import { ref, unref } from "vue";
import { type ComponentProps } from "./dataList.vue";
import { ResponsePageJson } from "@/config/request";

export function useDataList(emits: any, props: ComponentProps) {
  const currentPage = ref<number>(PAGE);
  const pageSize = ref<number>(999);
  const total = ref(0);
  const loading = ref<boolean>(true);
  const list = ref<any[]>([]);
  const loadingMore = ref<boolean>(false);
  const uApi = ref<((params: any) => Promise<ResponsePageJson<any>>) | null>(
    null,
  );
  const uNameKey = ref<string>("");
  const uValueKey = ref<string>("");
  const searchKey = ref<string>("");
  const defaultList = ref<any[]>([]);

  // 获取列表
  const getListFun = async (load: boolean = false) => {
    if (load) {
      loadingMore.value = true;
    } else {
      loading.value = true;
    }
    try {
      if (uApi.value) {
        const params: { [name: string]: any } = {
          page: unref(currentPage),
          page_size: unref(pageSize),
          ...(props.extraParams ? props.extraParams : {}),
        };
        if (unref(searchKey)) params[unref(uNameKey)] = unref(searchKey);
        const { data } = await uApi.value(params);
        const newList = (data?.list || []).map((item: any) => {
          return {
            ...item,
            checked: false,
          };
        });
        list.value = [...list.value, ...handleDefaultSelect(newList)];
        total.value = data?.total || 0;
      }
      if (unref(list).length < unref(total)) {
        loadingMore.value = true;
      } else {
        loadingMore.value = false;
      }
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  // 处理回显
  const handleDefaultSelect = (cList: any[] = list.value): any[] => {
    if (unref(defaultList) && unref(defaultList).length) {
      return cList.map((item: any) => {
        let checked: boolean = false;
        if (unref(defaultList).includes(item[unref(uValueKey)])) {
          checked = true;
        } else {
          checked = false;
        }
        return {
          ...item,
          checked,
        };
      });
    } else {
      return cList;
    }
  };

  // 加载更多
  const loadMore = () => {
    if (unref(list).length < unref(total)) {
      currentPage.value++;
      getListFun(true);
    }
  };

  // 选中
  const clickItem = (item: any) => {
    if (!props.multiple) {
      unref(list).forEach((item) => (item.checked = false));
    }
    item.checked = !item.checked;
    checkBoxChange();
  };

  // 选中checkBox
  const checkBoxChange = () => {
    const newList = new Set<string>();
    unref(defaultList).forEach((item) => {
      const listItem = unref(list).find((v) => v[unref(uValueKey)] === item);
      if (listItem && listItem.checked) {
        newList.add(listItem[unref(uValueKey)]);
      }
      if (!listItem) {
        newList.add(item);
      }
    });
    console.log(unref(list));
    unref(list).forEach((item) => {
      if (item.checked) {
        newList.add(item[unref(uValueKey)]);
      }
    });
    if (props.multiple) {
      emits("change", Array.from(newList));
    } else {
      emits("change", Array.from(newList)[0]);
    }
  };

  // 搜索
  const searchFun = () => {
    currentPage.value = 1;
    list.value = [];
    getListFun();
  };
  return {
    checkBoxChange,
    loadMore,
    getListFun,
    clickItem,
    searchFun,
    handleDefaultSelect,
    uNameKey,
    uValueKey,
    list,
    loadingMore,
    loading,
    uApi,
    searchKey,
    defaultList,
  };
}
