import type { FilterColumnsProp } from "@/components/FilterContainer/types";
import { Download } from "@element-plus/icons-vue";
import type {
  HandleRightColumnProps,
  TableColumnProps,
} from "tsx-element-table";
import { h } from "vue";

export const filterColumns: FilterColumnsProp[] = [
  {
    label: "平台",
    type: "select",
    prop: "platform",
    selectOptions: [
      {
        label: "沃尔玛",
        value: "walmart",
      },
      {
        label: "Tiktok",
        value: "tiktok",
      },
    ],
  },
];

export const tableColumns: TableColumnProps[] = [
  {
    label: "平台",
    prop: "platform",
    align: "center",
    width: 180,
  },
  {
    label: "店铺名称",
    prop: "shopName",
    width: 180,
    align: "center",
  },
  {
    label: "店铺ID",
    prop: "shopId",
    width: 180,
    align: "center",
  },
  {
    label: "总链接数量",
    prop: "totalLinkCount",
    minWidth: 160,
    align: "center",
    formatter: (_row, _column, cellValue) => {
      return h("b", null, cellValue);
    },
  },
  {
    label: "在售链接数量",
    prop: "onSaleLinkCount",
    minWidth: 160,
    align: "center",
    formatter: (_row, _column, cellValue) => {
      return h("b", null, cellValue);
    },
  },
  {
    label: "当天上架链接数量",
    prop: "todayOnSaleLinkCount",
    minWidth: 160,
    align: "center",
    formatter: (_row, _column, cellValue) => {
      return h("b", null, cellValue);
    },
  },
  {
    label: "当天下架链接数量",
    prop: "todayOffSaleLinkCount",
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
