import type {
  HandleRightColumnProps,
  TableColumnProps,
} from "tsx-element-table";
import { FilterColumnsProp } from "@/components/FilterContainer/types";
import { TiktokStausEnum } from "@/api/order/tiktok";
import { h } from "vue";
import { Download } from "@element-plus/icons-vue";
import { ElText } from "element-plus";

const tiktokStatusMap: Array<{
  label: string;
  value: TiktokStausEnum;
  type: "primary" | "success" | "info" | "warning" | "danger";
}> = [
  {
    label: "待支付",
    value: TiktokStausEnum.UNPAID,
    type: "info",
  },
  {
    label: "已被接受",
    value: TiktokStausEnum.ON_HOLD,
    type: "info",
  },
  {
    label: "等待发货",
    value: TiktokStausEnum.AWAITING_SHIPMENT,
    type: "warning",
  },
  {
    label: "部分发货",
    value: TiktokStausEnum.PARTIALLY_SHIPPING,
    type: "info",
  },
  {
    label: "等待收货",
    value: TiktokStausEnum.AWAITING_COLLECTION,
    type: "info",
  },
  {
    label: "在途",
    value: TiktokStausEnum.IN_TRANSIT,
    type: "info",
  },
  {
    label: "已送达",
    value: TiktokStausEnum.DELIVERED,
    type: "info",
  },
  {
    label: "已完成",
    value: TiktokStausEnum.COMPLETED,
    type: "success",
  },
  {
    label: "已取消",
    value: TiktokStausEnum.CANCELLED,
    type: "danger",
  },
];

export const filterColumns: FilterColumnsProp[] = [
  {
    label: "所属店铺",
    prop: "shopId",
  },
  {
    label: "订单号",
    type: "multiple",
    prop: "orderSn",
  },
  {
    label: "订单状态",
    type: "select",
    prop: "orderStatus",
    selectOptions: tiktokStatusMap,
  },
];

export const tableColumns: TableColumnProps[] = [
  {
    label: "#",
    width: 50,
    align: "center",
    type: "selection",
    reserveSelection: true,
    prop: "selection",
  },
  {
    label: "订单号",
    align: "center",
    width: 180,
    prop: "orderSn",
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
    width: 180,
    showOverflowTooltip: true,
    prop: "shopName",
  },
  {
    label: "订单状态",
    align: "center",
    minWidth: 140,
    prop: "orderStatus",
    formatter: (_row, _column, cellValue) => {
      const status = tiktokStatusMap.find((item) => item.value === cellValue);
      return h(ElText, { type: status?.type || "info" }, status?.label || "");
    },
  },
  {
    label: "匹对ASIN",
    align: "center",
    width: 180,
    prop: "asin",
  },
  {
    label: "总金额",
    align: "center",
    prop: "totalAmount",
    width: 100,
    formatter: (_row, _column, _cellValue) => {
      return h("b", null, `$ ${parseFloat(_cellValue || "0").toFixed(2)}`);
    },
  },
  {
    label: "产品金额",
    align: "center",
    prop: "productAmount",
    width: 100,
    formatter: (_row, _column, _cellValue) => {
      return h("b", null, `$ ${parseFloat(_cellValue || "0").toFixed(2)}`);
    },
  },
  {
    label: "运费",
    align: "center",
    prop: "shippingFee",
    width: 100,
    formatter: (_row, _column, _cellValue) => {
      return h("b", null, `$ ${parseFloat(_cellValue || "0").toFixed(2)}`);
    },
  },
  {
    label: "税费",
    align: "center",
    prop: "taxFee",
    width: 100,
    formatter: (_row, _column, _cellValue) => {
      return h("b", null, `$ ${parseFloat(_cellValue || "0").toFixed(2)}`);
    },
  },
  {
    label: "下单时间",
    align: "center",
    prop: "orderTime",
    minWidth: 120,
  },
  {
    label: "更新时间",
    align: "center",
    prop: "updateTime",
    minWidth: 120,
  },
  {
    label: "买家姓名",
    align: "center",
    prop: "name",
    minWidth: 140,
    showOverflowTooltip: true,
  },
  {
    label: "收货地址",
    align: "center",
    minWidth: 200,
    prop: "address",
  },
  {
    label: "买家备注",
    align: "center",
    prop: "remark",
    minWidth: 160,
  },
  {
    label: "物流信息",
    align: "center",
    minWidth: 200,
    prop: "logisticsInfo",
  },
  {
    label: "操作",
    align: "center",
    width: 100,
    fixed: "right",
    prop: "action",
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
