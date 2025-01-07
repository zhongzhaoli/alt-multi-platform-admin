import { ProductStatusEnum } from "@/api/product/local";
import type { FilterColumnsProp } from "@/components/FilterContainer/types";
import { Download } from "@element-plus/icons-vue";
import { ElText } from "element-plus";
import type {
  HandleRightColumnProps,
  TableColumnProps,
} from "tsx-element-table";
import { h } from "vue";

const localProductStatusMap: Array<{
  label: string;
  value: ProductStatusEnum;
  type: "primary" | "success" | "info" | "warning" | "danger";
}> = [
  {
    label: "在售",
    value: ProductStatusEnum.ON_SALE,
    type: "success",
  },
  {
    label: "下架",
    value: ProductStatusEnum.OFF_SALE,
    type: "danger",
  },
  {
    label: "断货",
    value: ProductStatusEnum.OUT_OF_STOCK,
    type: "info",
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
    label: "状态",
    prop: "status",
    type: "select",
    selectOptions: localProductStatusMap,
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
    label: "商品信息",
    align: "center",
    minWidth: 300,
    prop: "productInfo",
  },
  {
    label: "卖家国籍",
    align: "center",
    minWidth: 140,
    prop: "sellerCountry",
  },
  {
    label: "品牌",
    align: "center",
    minWidth: 140,
    prop: "brand",
  },
  {
    label: "状态",
    align: "center",
    minWidth: 140,
    prop: "status",
    formatter: (_row, _column, cellValue) => {
      const status = localProductStatusMap.find(
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
    label: "价格",
    align: "center",
    prop: "price",
    minWidth: 140,
    formatter: (_row, _column, cellValue) => {
      return h("b", null, `$ ${parseFloat(cellValue).toFixed(2)}`);
    },
  },
  {
    label: "配送方式（是否FBA）",
    align: "center",
    prop: "deliveryMethod",
    minWidth: 150,
  },
  {
    label: "配送时效（是否7天内）",
    align: "center",
    prop: "deliveryTime",
    minWidth: 150,
  },
  {
    label: "上架店铺",
    align: "center",
    prop: "shops",
    minWidth: 150,
  },
];

export const shopsTableColumns: TableColumnProps[] = [
  {
    label: "店铺名称",
    align: "center",
    minWidth: 140,
    showOverflowTooltip: true,
  },
  {
    label: "Item ID",
    align: "center",
    minWidth: 140,
    showOverflowTooltip: true,
  },
  {
    label: "SKU",
    align: "center",
    minWidth: 140,
    showOverflowTooltip: true,
  },
  {
    label: "上架时间",
    align: "center",
    minWidth: 140,
    showOverflowTooltip: true,
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
