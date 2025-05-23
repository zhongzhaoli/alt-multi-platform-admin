import type { HandleRightColumnProps, TableColumnProps } from 'tsx-element-table';
import { FilterColumnProps } from '@/components/FilterContainer/types';
import { h } from 'vue';
import { WalmartOrderProps, WalmartStausEnum } from '@/api/order/walmart';
import PriceItem from '@/components/PriceItem/index.vue';
import { Download } from '@element-plus/icons-vue';

export const walmartStatusMap: Array<{
  label: string;
  value: WalmartStausEnum;
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}> = [
  {
    label: '已创建',
    value: WalmartStausEnum.Created,
    type: 'info'
  },
  {
    label: '已确认',
    value: WalmartStausEnum.Acknowledged,
    type: 'info'
  },
  {
    label: '在途',
    value: WalmartStausEnum.Shipped,
    type: 'info'
  },
  {
    label: '已送达',
    value: WalmartStausEnum.Delivered,
    type: 'success'
  },
  {
    label: '已取消',
    value: WalmartStausEnum.Cancelled,
    type: 'danger'
  },
  {
    label: '退款',
    value: WalmartStausEnum.Refund,
    type: 'danger'
  }
];

export const filterColumns: FilterColumnProps[] = [
  {
    label: '所属店铺',
    type: 'select',
    prop: 'shop_id',
    width: 240,
    multiple: true,
    selectOptions: []
  },
  {
    label: 'PO单号',
    type: 'input',
    multiple: true,
    prop: 'purchase_order_id'
  },
  {
    label: 'CO单号',
    type: 'input',
    multiple: true,
    prop: 'customer_order_id'
  },
  {
    label: 'SKU',
    type: 'input',
    multiple: true,
    prop: 'skus'
  },
  {
    label: '订单状态',
    type: 'select',
    prop: 'order_line_status',
    multiple: true,
    selectOptions: walmartStatusMap
  },
  {
    label: '下单时间',
    type: 'dateRange',
    startKey: 'start_date',
    endKey: 'end_date',
    prop: 'order_date',
    width: 240
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '#',
    width: 50,
    align: 'center',
    type: 'selection',
    reserveSelection: true,
    selectable: (row: WalmartOrderProps) => {
      return row.children.every(
        (row) =>
          row.order_line_status === WalmartStausEnum.Created ||
          row.order_line_status === WalmartStausEnum.Acknowledged
      );
    },
    prop: 'selection'
  },
  {
    label: '订单号',
    align: 'center',
    width: 210,
    prop: 'orderNo'
  },
  {
    label: '店铺名称',
    align: 'center',
    width: 140,
    prop: 'shop_name'
  },
  {
    label: '下单时间',
    align: 'center',
    prop: 'order_date',
    minWidth: 180
  },
  {
    label: '需求发货时间',
    align: 'center',
    prop: 'estimated_ship_date',
    minWidth: 180
  },
  {
    label: '订单总金额',
    align: 'center',
    prop: 'order_total',
    minWidth: 140,
    formatter: (_row, _column, cellValue) => {
      return h(PriceItem, { price: cellValue, bold: true, cent: false });
    }
  },
  {
    label: '收货地址',
    align: 'center',
    minWidth: 220,
    prop: 'address'
  },
  {
    label: '物流信息',
    align: 'center',
    minWidth: 220,
    prop: 'logisticsInfo'
  },
  {
    label: '商品信息',
    align: 'center',
    prop: 'productInfo',
    minWidth: 300
  },
  {
    label: '订单状态',
    align: 'center',
    width: 120,
    prop: 'order_line_status'
  },
  {
    label: '匹对ASIN',
    align: 'center',
    width: 160,
    prop: 'asin'
  },
  {
    label: '金额',
    align: 'center',
    prop: 'charge_amount',
    width: 100
  },
  {
    label: '产品金额',
    align: 'center',
    prop: 'charge_amount_product',
    width: 100
  },
  {
    label: '运费',
    align: 'center',
    prop: 'charge_amount_shipping',
    width: 100
  },
  {
    label: '税费',
    align: 'center',
    prop: 'taxFee',
    width: 100
  },
  {
    label: '操作',
    align: 'center',
    width: 100,
    fixed: 'right',
    prop: 'action'
  }
];

// 右侧导出按钮
export const handleRightColumns: HandleRightColumnProps[] = [
  {
    key: 'export',
    tooltip: '数据导出',
    loading: false,
    icon: Download
  }
];
