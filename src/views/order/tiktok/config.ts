import type { HandleRightColumnProps, TableColumnProps } from 'tsx-element-table';
import { FilterColumnProps } from '@/components/FilterContainer/types';
import { TiktokStausEnum, TiktokOrderProps } from '@/api/order/tiktok';
import { h } from 'vue';
import { Download } from '@element-plus/icons-vue';
import { ElText } from 'element-plus';

const tiktokStatusMap: Array<{
  label: string;
  value: TiktokStausEnum;
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}> = [
  {
    label: '待支付',
    value: TiktokStausEnum.UNPAID,
    type: 'info'
  },
  {
    label: '已被接受',
    value: TiktokStausEnum.ON_HOLD,
    type: 'info'
  },
  {
    label: '等待发货',
    value: TiktokStausEnum.AWAITING_SHIPMENT,
    type: 'warning'
  },
  {
    label: '部分发货',
    value: TiktokStausEnum.PARTIALLY_SHIPPING,
    type: 'info'
  },
  {
    label: '等待收货',
    value: TiktokStausEnum.AWAITING_COLLECTION,
    type: 'info'
  },
  {
    label: '在途',
    value: TiktokStausEnum.IN_TRANSIT,
    type: 'info'
  },
  {
    label: '已送达',
    value: TiktokStausEnum.DELIVERED,
    type: 'info'
  },
  {
    label: '已完成',
    value: TiktokStausEnum.COMPLETED,
    type: 'success'
  },
  {
    label: '已取消',
    value: TiktokStausEnum.CANCELLED,
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
    label: '订单号',
    type: 'input',
    multiple: true,
    prop: 'order_id'
  },
  {
    label: '订单状态',
    type: 'select',
    multiple: true,
    prop: 'order_status',
    selectOptions: tiktokStatusMap
  },
  {
    label: '创建时间',
    type: 'dateRange',
    startKey: 'start_date',
    endKey: 'end_date',
    prop: 'order_date',
    width: 230
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '#',
    width: 50,
    align: 'center',
    type: 'selection',
    reserveSelection: true,
    selectable: (row: TiktokOrderProps) => {
      return row.status === TiktokStausEnum.AWAITING_SHIPMENT;
    },
    prop: 'selection'
  },
  {
    label: '订单号',
    align: 'center',
    width: 200,
    prop: 'orderSn'
  },
  {
    label: '店铺名称',
    align: 'center',
    width: 160,
    showOverflowTooltip: true,
    prop: 'shop_name'
  },
  {
    label: '下单时间',
    align: 'center',
    prop: 'create_time',
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    minWidth: 180
  },
  {
    label: '订单状态',
    align: 'center',
    minWidth: 140,
    prop: 'status',
    formatter: (_row, _column, cellValue) => {
      const status = tiktokStatusMap.find((item) => item.value === cellValue);
      return h(ElText, { type: status?.type || 'info' }, () => status?.label || '');
    }
  },
  {
    label: '运费',
    align: 'center',
    prop: 'shipping_fee',
    width: 100,
    formatter: (_row, _column, _cellValue) => {
      return h('b', null, `$ ${parseFloat(_cellValue || '0').toFixed(2)}`);
    }
  },
  {
    label: '总金额',
    align: 'center',
    prop: 'total_amount',
    width: 140,
    formatter: (_row, _column, _cellValue) => {
      return h('b', null, `$ ${parseFloat(_cellValue || '0').toFixed(2)}`);
    }
  },
  {
    label: '收货地址',
    align: 'center',
    minWidth: 200,
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
    minWidth: 300,
    prop: 'productInfo'
  },
  {
    label: '产品金额',
    align: 'center',
    prop: 'sale_price',
    width: 140
  },
  {
    label: '税费',
    align: 'center',
    prop: 'item_tax',
    width: 100
  },
  {
    label: '买家备注',
    align: 'center',
    prop: 'remark',
    minWidth: 160
  }
  // {
  //   label: '操作',
  //   align: 'center',
  //   width: 130,
  //   fixed: 'right',
  //   prop: 'action'
  // }
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
