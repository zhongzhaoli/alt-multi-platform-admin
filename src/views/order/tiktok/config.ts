import type { TableColumnProps } from 'tsx-element-table';
import { FilterColumnsProp } from '@/components/FilterContainer/types';
import { h } from 'vue';

export const filterColumns: FilterColumnsProp[] = [
  {
    label: '所属店铺',
    prop: 'shopId',
  },
  {
    label: '订单号',
    type: 'multiple',
    prop: 'orderSn',
  },
  {
    label: '订单状态',
    type: 'select',
    prop: 'orderStatus',
  },
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '#',
    width: 50,
    align: 'center',
    type: 'selection',
    reserveSelection: true,
    prop: 'selection',
  },
  {
    label: '订单号',
    align: 'center',
    width: 180,
    prop: 'orderNo',
  },
  {
    label: '商品信息',
    align: 'center',
    minWidth: 300,
    prop: 'productInfo',
  },
  {
    label: '店铺名称',
    align: 'center',
    width: 180,
    showOverflowTooltip: true,
    prop: 'shopName',
  },
  {
    label: '订单状态',
    align: 'center',
    minWidth: 100,
    prop: 'orderStatus',
  },
  {
    label: '匹对ASIN',
    align: 'center',
    width: 180,
    prop: 'asin',
  },
  {
    label: '总金额',
    align: 'center',
    prop: 'totalAmount',
    width: 100,
    formatter: (_row, _column, _cellValue) => {
      return h('b', null, `$ ${parseFloat(_cellValue || '0').toFixed(2)}`);
    },
  },
  {
    label: '产品金额',
    align: 'center',
    prop: 'productAmount',
    width: 100,
    formatter: (_row, _column, _cellValue) => {
      return h('b', null, `$ ${parseFloat(_cellValue || '0').toFixed(2)}`);
    },
  },
  {
    label: '运费',
    align: 'center',
    prop: 'shippingFee',
    width: 100,
    formatter: (_row, _column, _cellValue) => {
      return h('b', null, `$ ${parseFloat(_cellValue || '0').toFixed(2)}`);
    },
  },
  {
    label: '税费',
    align: 'center',
    prop: 'taxFee',
    width: 100,
    formatter: (_row, _column, _cellValue) => {
      return h('b', null, `$ ${parseFloat(_cellValue || '0').toFixed(2)}`);
    },
  },
  {
    label: '下单时间',
    align: 'center',
    prop: 'orderTime',
    minWidth: 120,
  },
  {
    label: '更新时间',
    align: 'center',
    prop: 'updateTime',
    minWidth: 120,
  },
  {
    label: '买家姓名',
    align: 'center',
    prop: 'name',
    minWidth: 140,
    showOverflowTooltip: true,
  },
  {
    label: '收货地址',
    align: 'center',
    minWidth: 200,
    prop: 'address',
  },
  {
    label: '买家备注',
    align: 'center',
    prop: 'remark',
    showOverflowTooltip: true,
    minWidth: 160,
  },
  {
    label: '物流信息',
    align: 'center',
    minWidth: 200,
    prop: 'logisticsInfo',
  },
  {
    label: '操作',
    align: 'center',
    width: 100,
    fixed: 'right',
    prop: 'action',
  },
];
