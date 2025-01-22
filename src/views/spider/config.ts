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
    prop: 'crawl_date',
    minWidth: 180,
    align: 'center'
  },
  {
    label: '爬虫总数',
    prop: 'req_total',
    minWidth: 180,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  },
  {
    label: '成功次数',
    prop: 'req_200',
    minWidth: 180,
    align: 'center'
  },
  {
    label: '人机次数',
    prop: 'req_captcha',
    minWidth: 180,
    align: 'center'
  },
  {
    label: '人机率',
    prop: 'fail_rate',
    minWidth: 180,
    align: 'center',
    formatter: (row, _column, _cellValue) => {
      return h('b', null, ((row.req_captcha / row.req_total) * 100).toFixed(2) + '%');
    }
  },
  {
    label: '成功率',
    prop: 'success_rate',
    minWidth: 180,
    align: 'center',
    formatter: (row, _column, _cellValue) => {
      return h('b', null, ((row.req_200 / row.req_total) * 100).toFixed(2) + '%');
    }
  }
];
