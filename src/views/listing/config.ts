import type { FilterColumnsProp } from "@/components/FilterContainer/types";
import { Download } from "@element-plus/icons-vue";
import type {
  HandleRightColumnProps,
  TableColumnProps,
} from "tsx-element-table";
import { h } from "vue";

const platformMap: Array<{ label: string; value: string }> = [
  {
    label: "沃尔玛",
    value: "Walmart",
  },
  {
    label: "Tiktok",
    value: "Tiktok",
  },
];

export const filterColumns: FilterColumnsProp[] = [
  {
    label: "平台",
    type: "select",
    prop: "platform",
    selectOptions: platformMap,
  },
];

export const tableColumns: TableColumnProps[] = [
  {
    label: "平台",
    prop: "platform",
    align: "center",
    width: 180,
    formatter: (_row, _column, cellValue) => {
      const platform = platformMap.find((item) => item.value === cellValue);
      return h("span", null, platform?.label || "-");
    },
  },
  {
    label: "店铺名称",
    prop: "shop_name",
    width: 180,
    align: "center",
  },
  {
    label: "店铺ID",
    prop: "shop_id",
    width: 180,
    align: "center",
  },
  {
    label: "总链接数量",
    prop: "all_count",
    minWidth: 160,
    align: "center",
    formatter: (_row, _column, cellValue) => {
      return h("b", null, cellValue);
    },
  },
  {
    label: "在售链接数量",
    prop: "for_sale_count",
    minWidth: 160,
    align: "center",
    formatter: (_row, _column, cellValue) => {
      return h("b", null, cellValue);
    },
  },
  {
    label: "当天上架链接数量",
    prop: "listing_count",
    minWidth: 160,
    align: "center",
    formatter: (_row, _column, cellValue) => {
      return h("b", null, cellValue);
    },
  },
  {
    label: "当天下架链接数量",
    prop: "remove_count",
    minWidth: 160,
    align: "center",
    formatter: (_row, _column, cellValue) => {
      return h("b", null, cellValue);
    },
  },
];

// 右侧导出按钮
export const handleRightColumns: HandleRightColumnProps[] = [
  {
    key: "export",
    tooltip: "数据导出",
    loading: false,
    icon: Download,
  },
];
