import { FilterColumnProps } from '@/components/FilterContainer/types';
import { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

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
    label: '日期',
    type: 'dateRange',
    prop: 'created_date',
    width: 240,
    startKey: 'start_date',
    endKey: 'end_date'
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '店铺名称',
    prop: 'shop_name',
    minWidth: 140,
    showOverflowTooltip: true,
    align: 'center'
  },
  {
    label: '日期',
    prop: 'date',
    minWidth: 140,
    showOverflowTooltip: true,
    align: 'center'
  },
  {
    label: '上架成功',
    prop: 'push_success_amount',
    minWidth: 140,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || '-');
    }
  },
  {
    label: '上架失败',
    prop: 'push_fail_amount',
    minWidth: 140,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || '-');
    }
  }
];
