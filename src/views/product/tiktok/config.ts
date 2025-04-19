import { ProductStatus } from '@/api/product/tiktok';
import type { FilterColumnProps } from '@/components/FilterContainer/types';
import { Download } from '@element-plus/icons-vue';
import { ElText, FormRules } from 'element-plus';
import type { HandleRightColumnProps, TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

const tiktokProductStatusMap: Array<{
  label: string;
  value: ProductStatus;
  type: 'primary' | 'success' | 'info' | 'warning' | 'danger';
}> = [
  {
    label: '失败',
    value: 0,
    type: 'danger'
  },
  {
    label: '成功',
    value: 1,
    type: 'success'
  },
  {
    label: '下架',
    value: 2,
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
    selectOptions: tiktokProductStatusMap
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
    label: '产品SKU信息',
    type: 'input',
    multiple: true,
    prop: 'SKU',
    width: 280,
    prefixSelect: {
      options: [
        {
          label: 'SKU',
          value: 'sku_id'
        },
        {
          label: '卖家SKU',
          value: 'seller_sku'
        },
        {
          label: '全球SKU',
          value: 'global_sku_id'
        }
      ],
      width: 100
    }
  },
  {
    label: '产品ID信息',
    type: 'input',
    multiple: true,
    prop: 'product_id',
    width: 280,
    prefixSelect: {
      options: [
        {
          label: '产品ID',
          value: 'product_id'
        },
        {
          label: '全球产品ID',
          value: 'global_product_id'
        }
      ],
      width: 110
    }
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
    label: '商品信息',
    align: 'center',
    minWidth: 330,
    prop: 'productInfo'
  },
  {
    label: 'SKU / 全球SKU',
    align: 'center',
    width: 180,
    prop: 'sku'
  },
  {
    label: '卖家SKU',
    align: 'center',
    width: 180,
    prop: 'seller_sku'
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
    label: '配送费 / 仓库ID',
    align: 'center',
    prop: 'shipping_fee',
    width: 200
  },
  {
    label: '状态',
    align: 'center',
    minWidth: 120,
    prop: 'status',
    formatter: (_row, _column, cellValue) => {
      const status = tiktokProductStatusMap.find((item) => item.value === cellValue);
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
    fixed: 'right',
    width: 120
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
