import { ProductStatus } from '@/api/product/temu';
import type { FilterColumnProps } from '@/components/FilterContainer/types';
import { Download } from '@element-plus/icons-vue';
import { ElTag, ElText, FormRules } from 'element-plus';
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
    label: '上架中(发布至temu - 核价)',
    value: 1,
    type: 'warning'
  },
  {
    label: '上架成功(在售)',
    value: 2,
    type: 'success'
  },
  {
    label: '未发布至站点(已有temu价格)',
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
  },
  {
    label: '类目匹配错误',
    value: 7,
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
    width: 180,
    selectOptions: sheinProductStatusMap
  },
  {
    label: '监控',
    prop: 'monitor',
    type: 'select',
    width: 180,
    selectOptions: [
      {
        label: '已开启',
        value: 1
      },
      {
        label: '未开启',
        value: 0
      }
    ]
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
        },
        {
          label: 'ATU',
          value: 'asin_to_sku'
        }
      ],
      width: 100
    }
  },
  {
    label: '日期范围',
    prop: 'date',
    type: 'dateRange',
    multiple: true,
    width: 320,
    startKey: 'start_date',
    endKey: 'end_date',
    prefixSelect: {
      options: [
        {
          label: '发布日期',
          value: 'push_date'
        },
        {
          label: '核对日期',
          value: 'confirm_date'
        }
      ],
      width: 100
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
    label: 'ATU / PTU',
    align: 'center',
    width: 220,
    prop: 'supplier'
  },
  {
    label: '平台Item ID',
    align: 'center',
    width: 140,
    prop: 'platformItemId'
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
    width: 120,
    prop: 'shop_id'
  },
  {
    label: '监控',
    align: 'center',
    width: 120,
    prop: 'monitor',
    formatter: (_row, _column, cellValue) => {
      return h(ElTag, { disableTransitions: true, type: cellValue ? 'success' : 'info' }, () =>
        cellValue ? '已开启' : '未开启'
      );
    }
  },
  {
    label: '原价 / 卖家报价 / Temu报价',
    align: 'center',
    prop: 'price',
    minWidth: 210,
    formatter: (row) => {
      const price = row.price ? `$${row.price.toFixed(2)}` : '-';
      const _price = row.ship_price ? `$${row.ship_price.toFixed(2)}` : '-';
      const __price = row.temu_price ? `$${row.temu_price.toFixed(2)}` : '-';
      return h(
        'span',
        {
          class: 'lineText'
        },
        [
          h('b', {}, price),
          h('span', {}, ' / '),
          h(
            'span',
            {
              style: {
                color: '#999'
              }
            },
            _price
          ),
          h('span', {}, ' / '),
          h(
            'b',
            {
              style: {
                color: '#ff7e7e'
              }
            },
            __price
          )
        ]
      );
    }
  },
  {
    label: '最新亚马逊价格',
    align: 'center',
    minWidth: 120,
    prop: 'amazon_price',
    formatter: (row) => {
      const price = row.amazon_price ? `$${row.amazon_price.toFixed(2)}` : '-';
      return h('b', {}, price);
    }
  },
  {
    label: '状态',
    align: 'center',
    minWidth: 210,
    prop: 'status',
    formatter: (_row, _column, cellValue) => {
      const status = sheinProductStatusMap.find((item) => item.value === cellValue);
      return h(ElText, { type: status?.type || 'info' }, () => status?.label || '');
    }
  },
  {
    label: '库存 / 亚马逊库存',
    align: 'center',
    prop: 'stock',
    minWidth: 140,
    formatter: (row, _column, cellValue) => {
      return h('span', null, [
        h('b', null, cellValue || 0),
        h('span', { style: { color: '#999' } }, ' / '),
        h('span', null, row.amazon_stock || 0)
      ]);
    }
  },
  {
    label: '亚马逊更新时间',
    align: 'center',
    minWidth: 180,
    prop: 'amazon_uptime'
  },
  {
    label: '发布日期',
    align: 'center',
    minWidth: 180,
    prop: 'push_date'
  },
  {
    label: '核价日期',
    align: 'center',
    minWidth: 180,
    prop: 'confirm_date'
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
