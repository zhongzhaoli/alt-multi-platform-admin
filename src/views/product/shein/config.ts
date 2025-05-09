import { ProductStatus } from '@/api/product/shein';
import type { FilterColumnProps } from '@/components/FilterContainer/types';
import { Download } from '@element-plus/icons-vue';
import { ElText, FormRules } from 'element-plus';
import type { HandleRightColumnProps, TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

const sheinProductStatusMap: Array<{
  label: string;
  value: ProductStatus;
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}> = [
  {
    label: '保存草稿',
    value: 0,
    type: 'info'
  },
  {
    label: '上架中(发布成功)',
    value: 1,
    type: 'warning'
  },
  {
    label: '上架成功',
    value: 2,
    type: 'success'
  },
  {
    label: '上架失败(核价不通过)',
    value: 3,
    type: 'danger'
  },
  {
    label: '发布失败',
    value: 4,
    type: 'danger'
  },
  {
    label: '撤回',
    value: 5,
    type: 'warning'
  },
  {
    label: '下架',
    value: 6,
    type: 'warning'
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
    width: 180,
    selectOptions: sheinProductStatusMap
  },
  {
    label: '产品ASIN信息',
    prop: 'keyword',
    type: 'input',
    multiple: true,
    width: 280,
    prefixSelect: {
      options: [
        {
          label: 'ASIN',
          value: 'asin'
        },
        {
          label: 'PASIN',
          value: 'pasin'
        }
      ],
      width: 100
    }
  },
  {
    label: 'SPC',
    prop: 'spc_name',
    type: 'input',
    multiple: true
  }
];

export const tableColumns: TableColumnProps[] = [
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
    label: 'ASIN / PASIN',
    align: 'center',
    width: 160,
    prop: 'asin'
  },
  {
    label: 'SUPPLIER',
    align: 'center',
    width: 220,
    prop: 'supplier'
  },
  {
    label: 'SKC / SPU',
    align: 'center',
    width: 180,
    prop: 'skc'
  },
  {
    label: '商品信息',
    align: 'center',
    minWidth: 330,
    prop: 'productInfo'
  },
  {
    label: '店铺名称',
    align: 'center',
    width: 140,
    showOverflowTooltip: true,
    prop: 'shop_name'
  },
  {
    label: '店铺ID',
    align: 'center',
    width: 180,
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
    minWidth: 200,
    prop: 'status',
    formatter: (_row, _column, cellValue) => {
      const status = sheinProductStatusMap.find((item) => item.value === cellValue);
      return h(ElText, { type: status?.type || 'info' }, () => status?.label || '');
    }
  },
  {
    label: '库存',
    align: 'center',
    prop: 'inventory_quantity',
    minWidth: 120,
    formatter: (_row, _column, cellValue) => {
      return h('b', null, cellValue || 0);
    }
  },
  {
    label: '更新时间',
    align: 'center',
    prop: 'updated_at',
    minWidth: 180
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

export const updateInventoryRules: FormRules = {
  stock: [
    {
      required: true,
      message: '请输入库存',
      trigger: 'blur'
    },
    {
      type: 'number',
      min: 0,
      message: '库存必须大于等于0',
      trigger: 'blur'
    },
    {
      type: 'number',
      max: 50,
      message: '库存必须小于等于50',
      trigger: 'blur'
    }
  ]
};
