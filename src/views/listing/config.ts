import { Download } from '@element-plus/icons-vue';
import type { HandleRightColumnProps, TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

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
    prop: 'created_at',
    minWidth: 180,
    align: 'center'
  },
  {
    label: '类型',
    prop: 'type',
    minWidth: 160,
    align: 'center'
  },
  // {
  //   label: '店铺存活状态',
  //   align: 'center',
  //   width: 160,
  //   prop: 'shop_survival'
  // },
  {
    label: '总链接数量',
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
    label: '上架成功数量',
    prop: 'items_succeeded',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  },
  {
    label: '上架失败数量',
    prop: 'items_failed',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  },
  {
    label: '上架率',
    prop: 'listing_rating',
    minWidth: 160,
    align: 'center',
    formatter: (_row, _column, cellValue: number) => {
      return h('b', null, `${(cellValue * 100).toFixed(2)}%`);
    }
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
