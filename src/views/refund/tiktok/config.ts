import type { FilterColumnsProp } from '@/components/FilterContainer/types';
import type { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export const filterColumns: FilterColumnsProp[] = [
  {
    label: '店铺名称',
    prop: 'shopName',
    type: 'select',
  },
  {
    label: '订单号',
    type: 'multiple',
    prop: 'orderSn',
  },
  {
    label: '请求日期',
    type: 'dateRange',
    prop: 'requestDate',
  },
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '订单号',
    align: 'center',
    width: 220,
    prop: 'orderNo',
  },
  {
    label: '店铺名称',
    align: 'center',
    width: 200,
    prop: 'shopName',
  },
  {
    label: '商品信息',
    align: 'center',
    minWidth: 300,
    prop: 'productInfo',
  },
  {
    label: '订单总金额',
    align: 'center',
    prop: 'totalAmount',
    minWidth: 140,
    formatter: (_row, _column, _cellValue) => {
      return h('b', null, `$ ${parseFloat(_cellValue || '0').toFixed(2)}`);
    },
  },
  {
    label: '订单状态',
    align: 'center',
    minWidth: 120,
    prop: 'orderStatus',
  },
  {
    label: '客户姓名',
    align: 'center',
    prop: 'name',
    minWidth: 140,
  },
  {
    label: '原因',
    align: 'center',
    prop: 'reason',
    minWidth: 150,
  },
  {
    label: '请求日期',
    align: 'center',
    prop: 'requestDate',
    minWidth: 150,
  },
  {
    label: '操作',
    align: 'center',
    prop: 'action',
    width: 160,
  },
];
