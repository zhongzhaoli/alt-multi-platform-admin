import { OrderStatusEnum } from "@/api/refund/tiktok";
import type { FilterColumnsProp } from "@/components/FilterContainer/types";
import { Download } from "@element-plus/icons-vue";
import { ElText } from "element-plus";
import type {
  HandleRightColumnProps,
  TableColumnProps,
} from "tsx-element-table";
import { h } from "vue";

export const orderStatusMap: Array<{
  label: string;
  value: OrderStatusEnum;
  type: "primary" | "success" | "info" | "warning" | "danger";
}> = [
  {
    label: "已发起",
    value: OrderStatusEnum.INITIATED,
    type: "info",
  },
  {
    label: "已取消",
    value: OrderStatusEnum.CANCELLED,
    type: "danger",
  },
  {
    label: "已退款",
    value: OrderStatusEnum.REFUNDED,
    type: "success",
  },
];

export const filterColumns: FilterColumnsProp[] = [
  {
    label: "店铺名称",
    prop: "shop_id",
  },
  {
    label: "订单号",
    type: "input",
    prop: "order_id",
  },
  {
    label: "订单状态",
    type: "select",
    prop: "order_status",
    selectOptions: orderStatusMap,
  },
];

export const tableColumns: TableColumnProps[] = [
  {
    label: "订单号",
    align: "center",
    width: 200,
    prop: "order_id",
  },
  {
    label: "店铺名称",
    align: "center",
    width: 160,
    prop: "shop_name",
  },
  {
    label: "商品信息",
    align: "center",
    minWidth: 300,
    prop: "productInfo",
  },
  {
    label: "订单总金额",
    align: "center",
    prop: "total_amount",
    minWidth: 130,
    formatter: (_row, _column, _cellValue) => {
      return h("b", null, `$ ${parseFloat(_cellValue || "0").toFixed(2)}`);
    },
  },
  {
    label: "订单状态",
    align: "center",
    minWidth: 120,
    prop: "order_status",
    formatter: (_row, _column, cellValue) => {
      const status = orderStatusMap.find((item) => item.value === cellValue);
      return h(ElText, { type: status?.type || "info" }, status?.label || "");
    },
  },
  {
    label: "客户姓名",
    align: "center",
    prop: "buyer_name",
    minWidth: 140,
  },
  {
    label: "原因",
    align: "center",
    prop: "reason",
    minWidth: 150,
  },
  {
    label: "请求日期",
    align: "center",
    prop: "update_time",
    minWidth: 160,
  },
  {
    label: "操作",
    align: "center",
    prop: "action",
    show: false,
    width: 160,
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
