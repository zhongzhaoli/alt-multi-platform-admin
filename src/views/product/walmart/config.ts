import { ProductStatus, ProductCheckStatus } from '@/api/product/walmart';
import type { FilterColumnProps } from '@/components/FilterContainer/types';
import { Download } from '@element-plus/icons-vue';
import { ElText } from 'element-plus';
import type { HandleRightColumnProps, TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

const walmartProductCheckStatusMap: Array<{
  label: string;
  value: ProductCheckStatus;
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}> = [
  {
    label: '未检查',
    value: 0,
    type: 'info'
  },
  {
    label: '已检查',
    value: 1,
    type: 'success'
  }
];

const walmartProductStatusMap: Array<{
  label: string;
  value: ProductStatus;
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}> = [
  {
    label: '未上架',
    value: 0,
    type: 'info'
  },
  {
    label: '已上架',
    value: 1,
    type: 'success'
  },
  {
    label: '上架失败',
    value: 2,
    type: 'danger'
  },
  {
    label: '下架',
    value: 3,
    type: 'danger'
  }
];

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
    label: '状态',
    prop: 'status',
    type: 'select',
    multiple: true,
    selectOptions: walmartProductStatusMap
  },
  {
    label: 'ASIN',
    prop: 'asin',
    type: 'input',
    multiple: true
  },
  {
    label: 'SKU',
    prop: 'sku',
    type: 'input',
    multiple: true
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    type: 'selection',
    label: '#',
    width: 50,
    align: 'center',
    prop: 'selection',
    reserveSelection: true
  },
  {
    label: '爬取平台',
    align: 'center',
    width: 120,
    prop: 'platform',
    formatter: (_row, _column, _cellValue) => {
      return '亚马逊';
    }
  },
  {
    label: 'ASIN',
    align: 'center',
    width: 160,
    prop: 'asin'
  },
  {
    label: '商品信息',
    align: 'center',
    minWidth: 300,
    prop: 'productInfo'
  },
  {
    label: '店铺名称',
    align: 'center',
    width: 200,
    showOverflowTooltip: true,
    prop: 'shop_name'
  },
  {
    label: '店铺ID',
    align: 'center',
    width: 140,
    prop: 'shop_id'
  },
  {
    label: '价格 / 亚马逊价格',
    align: 'center',
    prop: 'price',
    minWidth: 140,
    formatter: (row, _column, cellValue) => {
      return h('div', null, [
        h(
          'div',
          { style: { fontWeight: 'bold', color: '#000' } },
          `$ ${parseFloat(row.shop_price).toFixed(2)}`
        ),
        h('div', { style: { color: '#999' } }, `$ ${parseFloat(cellValue).toFixed(2)}`)
      ]);
    }
  },
  {
    label: '状态',
    align: 'center',
    minWidth: 120,
    prop: 'status',
    formatter: (_row, _column, cellValue) => {
      const status = walmartProductStatusMap.find((item) => item.value === cellValue);
      return h(ElText, { type: status?.type || 'info' }, () => status?.label || '');
    }
  },
  {
    label: '检查状态',
    align: 'center',
    minWidth: 120,
    prop: 'checked',
    formatter: (_row, _column, cellValue) => {
      const status = walmartProductCheckStatusMap.find((item) => item.value === cellValue);
      return h(ElText, { type: status?.type || 'info' }, () => status?.label || '');
    }
  },
  {
    label: '库存',
    align: 'center',
    prop: 'stock',
    minWidth: 120,
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue);
    }
  },
  {
    label: '更新时间',
    align: 'center',
    prop: 'updated_at',
    minWidth: 180
  },
  {
    label: '创建时间',
    align: 'center',
    prop: 'created_at',
    minWidth: 180
  },
  {
    label: '操作',
    align: 'center',
    prop: 'action',
    width: 120,
    fixed: 'right'
  }
];

// 右侧导出按钮
export const handleRightColumns: HandleRightColumnProps[] = [
  {
    key: 'export',
    tooltip: '数据导出',
    loading: false,
    icon: Download,
    show: false
  }
];
