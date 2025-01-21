import { type TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export const tableColumns: TableColumnProps[] = [
  {
    type: 'index',
    width: 50,
    align: 'center',
    label: '#'
  },
  {
    label: '日期',
    prop: 'date',
    minWidth: 180,
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    align: 'center'
  },
  {
    label: '爬虫总数',
    prop: 'spider_total',
    minWidth: 180,
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  },
  {
    label: '成功次数',
    prop: 'success_total',
    minWidth: 180,
    align: 'center'
  },
  {
    label: '人机次数',
    prop: 'fail_total',
    minWidth: 180,
    align: 'center'
  },
  {
    label: '人机率',
    prop: 'fail_rate',
    minWidth: 180,
    align: 'center'
  },
  {
    label: '成功率',
    prop: 'success_rate',
    minWidth: 180,
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  }
];
