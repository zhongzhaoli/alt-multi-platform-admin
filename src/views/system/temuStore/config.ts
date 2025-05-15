import { FilterColumnProps } from '@/components/FilterContainer/types';
import { type TableColumnProps } from 'tsx-element-table/src/types';

export interface FilterDto {
  shop_name: string;
}

export const filterColumns: FilterColumnProps[] = [
  {
    label: '店铺名称',
    type: 'input',
    prop: 'shop_name',
    width: 240
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: 'ID',
    align: 'center',
    width: 80,
    prop: 'id'
  },
  {
    label: '店铺ID',
    prop: 'shop_id',
    align: 'center',
    width: 220,
    showOverflowTooltip: true
  },
  {
    label: '店铺名称',
    prop: 'shop_name',
    width: 220,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '店铺状态',
    prop: 'shop_status',
    width: 220,
    align: 'center'
  },
  {
    label: 'ms Cookie',
    prop: 'miaoshou_cookie',
    minWidth: 200,
    align: 'center'
  },
  {
    label: 'Cookie',
    prop: 'temu_cookie',
    minWidth: 200,
    align: 'center'
  }
];
