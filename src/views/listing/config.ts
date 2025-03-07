import { FilterColumnProps } from '@/components/FilterContainer/types';
import { Download } from '@element-plus/icons-vue';
import type { HandleRightColumnProps, TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export interface FilterDto {
  type: 'Products' | 'Prices' | 'Inventory';
  start_date: string;
  end_date: string;
}

export const filterTypeOptions = [
  {
    label: '链接',
    value: 'Products'
  },
  {
    label: '价格',
    value: 'Prices'
  },
  {
    label: '库存',
    value: 'Inventory'
  }
];

export const filterColumns: FilterColumnProps[] = [
  // {
  //   label: '所属店铺',
  //   type: 'select',
  //   prop: 'shop_id',
  //   width: 280,
  //   multiple: true,
  //   selectOptions: []
  // },
  {
    label: '平台',
    type: 'select',
    prop: 'platform',
    width: 240,
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
    width: 200,
    showOverflowTooltip: true,
    align: 'center'
  },
  {
    label: '店铺ID',
    prop: 'shop_id',
    width: 180,
    align: 'center'
  },
  {
    label: '日期',
    prop: 'created_date',
    minWidth: 180,
    align: 'center'
  },
  // {
  //   label: '店铺存活状态',
  //   align: 'center',
  //   width: 160,
  //   prop: 'shop_survival'
  // },
  {
    label: '总数量',
    prop: 'items_received',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  },
  // {
  //   label: '在售链接数量',
  //   prop: 'for_sale_count',
  //   minWidth: 160,
  //   align: 'center',
  //   formatter: (_row, _column, cellValue) => {
  //     return h('b', null, cellValue);
  //   }
  // },
  {
    label: '执行中',
    prop: 'items_processing',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '成功',
    prop: 'items_succeeded',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '失败',
    prop: 'items_failed',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  },
  {
    label: '成功率',
    prop: 'listing_rating',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue: number) => {
      return h('b', null, `${(cellValue * 100).toFixed(2)}%`);
    }
  },
  {
    label: '操作',
    prop: 'action',
    width: 120,
    align: 'center'
  }
];

// 右侧导出按钮
export const handleRightColumns: HandleRightColumnProps[] = [
  {
    key: 'export',
    tooltip: '数据导出',
    loading: false,
    icon: Download
  }
];

// Feed List表格
export const feedListTableColumns: TableColumnProps[] = [
  {
    label: 'Feed Id',
    prop: 'feed_id',
    minWidth: 360,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '总数量',
    prop: 'items_received',
    width: 90,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  },
  {
    label: '执行中',
    prop: 'items_processing',
    width: 90,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  },
  {
    label: '成功',
    prop: 'items_succeeded',
    width: 90,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  },
  {
    label: '失败',
    prop: 'items_failed',
    width: 90,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  },
  {
    label: '状态',
    prop: 'feed_status',
    width: 120,
    align: 'center'
  },
  {
    label: '操作',
    prop: 'action',
    width: 100,
    align: 'center'
  }
];

// Feed List Detail表格
export const feedDetailTableColumns: TableColumnProps[] = [
  {
    label: '#',
    width: 50,
    align: 'center',
    type: 'expand',
    prop: 'expand'
  },
  {
    label: 'Feed Id',
    prop: 'feed_id',
    width: 380,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: 'SKU',
    prop: 'sku',
    minWidth: 180,
    align: 'center'
  },
  {
    label: 'Item Id',
    prop: 'item_id',
    minWidth: 120,
    align: 'center'
  },
  {
    label: '状态',
    prop: 'ingestion_status',
    minWidth: 120,
    align: 'center'
  }
];
