import { FilterColumnProps } from '@/components/FilterContainer/types';
import type { TableColumnProps } from 'tsx-element-table';

export interface FilterDto {
  card_number: string;
}

export const filterColumns: FilterColumnProps[] = [
  {
    label: '卡号',
    type: 'input',
    prop: 'card_number'
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: '信用卡号',
    prop: 'card_number',
    align: 'center',
    minWidth: 200
  },
  {
    label: '亚马逊邮箱',
    prop: 'card_email',
    align: 'center',
    minWidth: 200,
    formatter: (_row, _column, cellValue) => {
      return cellValue || '-';
    }
  },
  {
    label: '亚马逊手机号',
    prop: 'card_phone',
    align: 'center',
    minWidth: 200,
    formatter: (_row, _column, cellValue) => {
      return cellValue || '-';
    }
  },
  {
    label: '二步验证Token',
    prop: 'two_step_token',
    align: 'center',
    minWidth: 200,
    showOverflowTooltip: true,
    formatter: (_row, _column, cellValue) => {
      return cellValue || '-';
    }
  },
  {
    label: '二步验证图片',
    prop: 'two_step_image',
    align: 'center',
    width: 140
  },
  {
    label: '信用卡状态',
    prop: 'card_status',
    align: 'center',
    minWidth: 120,
    formatter: (_row, _column, cellValue) => {
      return cellValue || '-';
    }
  },
  {
    label: '最后操作时间',
    prop: 'last_operated_time',
    align: 'center',
    minWidth: 200
  },
  {
    label: '操作',
    prop: 'action',
    fixed: 'right',
    align: 'center',
    width: 160
  }
];
