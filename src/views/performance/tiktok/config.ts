import { FilterColumnProps } from '@/components/FilterContainer/types';
import { type TableColumnProps } from 'tsx-element-table/src/types';
import { h } from 'vue';

export interface FilterDto {
  shop_id: string;
}

export const filterColumns: FilterColumnProps[] = [
  {
    label: '所属店铺',
    type: 'select',
    prop: 'shop_id',
    width: 240,
    multiple: true,
    selectOptions: []
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '#',
    align: 'center',
    type: 'index',
    width: 50,
    prop: 'id'
  },
  {
    label: '店铺ID',
    prop: 'shop_id',
    align: 'center',
    width: 180,
    showOverflowTooltip: true
  },
  {
    label: '店铺名称',
    prop: 'shop_name',
    minWidth: 120,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '健康分',
    prop: 'score',
    minWidth: 120,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '违规次数',
    prop: 'violations',
    minWidth: 120,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return cellValue || 0;
    }
  },
  {
    label: '警告次数',
    prop: 'warnings',
    minWidth: 120,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return cellValue || 0;
    }
  },
  {
    label: '操作',
    width: 160,
    align: 'center',
    fixed: 'right',
    prop: 'handle'
  }
];
