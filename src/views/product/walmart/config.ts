import { ProductStatusEnum } from "@/api/product/walmart";
import type { FilterColumnsProp } from "@/components/FilterContainer/types";
import { Download } from "@element-plus/icons-vue";
import { ElText } from "element-plus";
import type {
  HandleRightColumnProps,
  TableColumnProps,
} from "tsx-element-table";
import { h } from "vue";

const walmartProductStatusMap: Array<{
  label: string;
  value: ProductStatusEnum;
  type: "primary" | "success" | "info" | "warning" | "danger";
}> = [
  {
    label: "未发布",
    value: ProductStatusEnum.UNPUBLISHED,
    type: "info",
  },
  {
    label: "已发布",
    value: ProductStatusEnum.PUBLISHED,
    type: "success",
  },
  {
    label: "错误",
    value: ProductStatusEnum.ERROR,
    type: "danger",
  },
];

export const filterColumns: FilterColumnsProp[] = [
  {
    label: "爬取平台",
    prop: "platform",
    type: "select",
    selectOptions: [
      {
        label: "亚马逊",
        value: "amazon",
      },
    ],
  },
  {
    label: "店铺名称",
    prop: "shopId",
    type: "select",
  },
  {
    label: "状态",
    prop: "status",
    type: "select",
    selectOptions: walmartProductStatusMap,
  },
];

export const tableColumns: TableColumnProps[] = [
  {
    label: "爬取平台",
    align: "center",
    width: 160,
    prop: "platform",
  },
  {
    label: "ASIN",
    align: "center",
    width: 160,
    prop: "asin",
  },
  {
    label: "商品信息",
    align: "center",
    minWidth: 300,
    prop: "productInfo",
  },
  {
    label: "店铺名称",
    align: "center",
    width: 200,
    showOverflowTooltip: true,
    prop: "shopName",
  },
  {
    label: "店铺ID",
    align: "center",
    width: 160,
    prop: "shopId",
  },
  {
    label: "价格",
    align: "center",
    prop: "price",
    minWidth: 140,
    formatter: (_row, _column, cellValue) => {
      return h("b", null, `$ ${parseFloat(cellValue).toFixed(2)}`);
    },
  },
  {
    label: "状态",
    align: "center",
    minWidth: 140,
    prop: "status",
    formatter: (_row, _column, cellValue) => {
      const status = walmartProductStatusMap.find(
        (item) => item.value === cellValue,
      );
      return h(
        ElText,
        { type: status?.type || "info" },
        () => status?.label || "",
      );
    },
  },
  {
    label: "库存",
    align: "center",
    prop: "stock",
    minWidth: 140,
    formatter: (_row, _column, cellValue) => {
      return h("b", null, cellValue);
    },
  },
  {
    label: "库存预警",
    align: "center",
    prop: "stockWarning",
    minWidth: 140,
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
