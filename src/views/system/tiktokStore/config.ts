import { type TableColumnProps } from "tsx-element-table/src/types";

export const tableColumns: TableColumnProps[] = [
  {
    label: "#",
    align: "center",
    type: "index",
  },
  {
    label: "店铺名称",
    prop: "shopName",
    minWidth: "300",
    align: "center",
    showOverflowTooltip: true,
  },
  {
    label: "店铺ID",
    prop: "shopId",
    align: "center",
    minWidth: "300",
    showOverflowTooltip: true,
  },
  {
    label: "创建时间",
    align: "center",
    prop: "createTime",
    width: "200",
  },
];
