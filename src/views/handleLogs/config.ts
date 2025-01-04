import { type FilterColumnsProp } from "@/components/FilterContainer/types";
import { type TableColumnProps } from "tsx-element-table";

export const filterColumns: FilterColumnsProp[] = [
  {
    label: "用户名称",
    prop: "user_name",
  },
];

export const tableColumns: TableColumnProps[] = [
  {
    label: "用户名称",
    align: "center",
    minWidth: "160",
    showOverflowTooltip: true,
    prop: "user_name",
  },
  {
    label: "IP地址",
    align: "center",
    minWidth: "140",
    prop: "ip",
  },
  {
    label: "地理位置",
    align: "center",
    minWidth: "140",
    showOverflowTooltip: true,
    prop: "location",
  },
  {
    label: "操作名称",
    align: "center",
    prop: "operation_name",
    showOverflowTooltip: true,
    minWidth: "160",
  },
  {
    label: "操作时间",
    align: "center",
    prop: "operation_time",
    width: "180",
  },
  {
    label: "操作状态",
    align: "center",
    prop: "operation_status",
    width: "120",
  },
  {
    label: "操作",
    align: "center",
    prop: "action",
    width: "120",
  },
];
