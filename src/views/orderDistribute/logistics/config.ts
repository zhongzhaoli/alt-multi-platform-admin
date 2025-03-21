import { FilterColumnProps } from '@/components/FilterContainer/types';
import moment from 'moment-timezone';
import { TableColumnProps } from 'tsx-element-table';

export interface FilterDto {
  ship_date: string;
  start_ship_date: string;
  end_ship_date: string;
  start_delivery_date: string;
  end_delivery_date: string;
  postal_code: string;
}

export const filterColumns: FilterColumnProps[] = [
  {
    label: '物流追踪号',
    type: 'input',
    prop: 'tracking_number'
  },
  {
    label: '邮编',
    type: 'input',
    prop: 'postal_code'
  },
  {
    label: '状态',
    type: 'input',
    prop: 'status'
  },
  {
    type: 'dateRange',
    label: '发货日期',
    prop: 'ship_date',
    width: 240,
    startKey: 'start_ship_date',
    startPlaceholder: '开始发货',
    endPlaceholder: '结束发货',
    endKey: 'end_ship_date'
  },
  {
    type: 'dateRange',
    label: '送达日期',
    prop: 'delivery_date',
    width: 240,
    startPlaceholder: '开始送达',
    endPlaceholder: '结束送达',
    startKey: 'start_delivery_date',
    endKey: 'end_delivery_date'
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    type: 'index',
    label: '#',
    align: 'center',
    width: 50
  },
  {
    label: '物流商',
    prop: 'carrier',
    align: 'center',
    width: 160
  },
  {
    label: '物流追踪号',
    prop: 'tracking_number',
    align: 'center',
    width: 240
  },
  {
    label: '邮编',
    prop: 'postal_code',
    align: 'center',
    width: 140
  },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    width: 120
  },
  {
    label: '发货时间',
    prop: 'ship_date',
    align: 'center',
    width: 180,
    formatter: (_row, _column, cellValue) => {
      return cellValue ? moment(cellValue).format('YYYY-MM-DD HH:mm:ss') : '-';
    }
  },
  {
    label: '预计送达日期',
    prop: 'delivery_date',
    align: 'center',
    width: 140,
    formatter: (_row, _column, cellValue) => {
      return cellValue ? moment(cellValue).format('YYYY-MM-DD') : '-';
    }
  },
  {
    label: '国家',
    prop: 'country',
    align: 'center',
    minWidth: 120,
    formatter: (_row, _column, cellValue) => {
      return cellValue || '-';
    }
  },
  {
    label: '发货地(洲)',
    prop: 'ship_path',
    align: 'center',
    minWidth: 120,
    formatter: (_row, _column, cellValue) => {
      return cellValue || '-';
    }
  },
  {
    label: '目的地(洲)',
    prop: 'delivery_path',
    align: 'center',
    minWidth: 120,
    formatter: (_row, _column, cellValue) => {
      return cellValue || '-';
    }
  }
];
