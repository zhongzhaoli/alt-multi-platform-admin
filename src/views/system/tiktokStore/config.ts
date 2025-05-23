import { FilterColumnProps } from '@/components/FilterContainer/types';
import { FormRules } from 'element-plus';
import { type TableColumnProps } from 'tsx-element-table/src/types';

export interface FilterDto {
  shop_name: string;
  available: 0 | 1;
  pause: 0 | 1;
}

export const filterColumns: FilterColumnProps[] = [
  {
    label: '店铺名称',
    type: 'input',
    prop: 'shop_name',
    width: 240
  },
  {
    label: '存活状态',
    type: 'select',
    prop: 'available',
    selectOptions: [
      {
        label: '存活',
        value: 1
      },
      {
        label: '死亡',
        value: 0
      }
    ]
  },
  {
    label: '开启上架',
    type: 'select',
    prop: 'pause',
    selectOptions: [
      {
        label: '开启',
        value: 1
      },
      {
        label: '关闭',
        value: 0
      }
    ]
  }
];

export const tableColumns: TableColumnProps[] = [
  {
    label: 'ID',
    align: 'center',
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
    label: '开启上架',
    prop: 'pause',
    width: 100,
    align: 'center'
  },
  {
    label: '是否存活',
    prop: 'available',
    width: 130,
    align: 'center'
  },
  {
    label: '分类名称',
    prop: 'category_name',
    minWidth: 140,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: 'App Key',
    prop: 'app_key',
    align: 'center',
    minWidth: 140
  },
  {
    label: 'App Secret',
    prop: 'app_secret',
    align: 'center',
    minWidth: 160
  },
  {
    label: '上架价格区间',
    width: 140,
    align: 'center',
    prop: 'listing_min_price',
    formatter: (row, _column, cellValue) => {
      return `$${cellValue.toFixed(2)} - $${row.listing_max_price.toFixed(2)}`;
    }
  },
  {
    label: '创建时间',
    align: 'center',
    prop: 'created_at',
    width: 180
  },
  {
    label: '操作',
    width: 80,
    align: 'center',
    fixed: 'right',
    prop: 'handle'
  }
];

export const editFormRules: FormRules = {
  shop_id: [
    {
      required: true,
      message: '店铺ID 不能为空',
      trigger: 'blur'
    }
  ],
  shop_name: [{ required: true, message: '请输入店铺名称', trigger: 'change' }],
  app_key: [{ required: true, message: '请输入店铺 App Key', trigger: 'change' }],
  app_secret: [{ required: true, message: '请输入店铺 App Secret', trigger: 'change' }]
};
