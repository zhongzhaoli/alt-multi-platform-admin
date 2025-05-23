import type { TableColumnProps } from 'tsx-element-table';
import type { FilterColumnProps } from '@/components/FilterContainer/types';
import { ElText } from 'element-plus';
import { h } from 'vue';

export interface FilterDto {
  shop_id: string;
  start_date: string;
  end_date: string;
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
    type: 'index',
    prop: 'index',
    align: 'center',
    width: 50
  },
  {
    label: '店铺名称',
    prop: 'shop_name',
    align: 'center',
    minWidth: 200
  },
  {
    label: '未读站内信',
    prop: 'message',
    align: 'center',
    minWidth: 150,
    formatter: (_row, _column, cellValue) => {
      return h(
        ElText,
        { type: cellValue ? 'danger' : 'info', style: { fontWeight: 'bold' } },
        {
          default: () => cellValue
        }
      );
    }
  },
  {
    label: '未读通知',
    prop: 'notification',
    align: 'center',
    minWidth: 150,
    formatter: (_row, _column, cellValue) => {
      return h(
        ElText,
        { type: cellValue ? 'danger' : 'info', style: { fontWeight: 'bold' } },
        {
          default: () => cellValue
        }
      );
    }
  },
  {
    label: '数据获取时间',
    prop: 'updated_at',
    align: 'center',
    minWidth: 240
  }
];
