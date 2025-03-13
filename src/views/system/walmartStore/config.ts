import { type HandleColumnProps, type TableColumnProps } from 'tsx-element-table';
import { FormRules } from 'element-plus';
import { FilterColumnProps } from '@/components/FilterContainer/types';

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
    width: 80,
    prop: 'id'
  },
  {
    label: '店铺ID',
    align: 'center',
    width: 120,
    prop: 'shop_id'
  },
  {
    label: '店铺名称',
    prop: 'shop_name',
    minWidth: 140,
    align: 'center'
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
    width: 100,
    align: 'center'
  },
  {
    label: 'Client',
    prop: 'client_id',
    minWidth: 240,
    align: 'center'
  },
  {
    label: 'Client Secret',
    prop: 'client_secret',
    minWidth: 240,
    align: 'center'
  },
  {
    label: '上架最大限制数量',
    width: 140,
    align: 'center',
    prop: 'max_limit',
    formatter: (_row, _column, cellValue) => {
      return cellValue ?? '-';
    }
  },
  {
    label: '每日上架限制数量',
    width: 140,
    align: 'center',
    prop: 'daily_limit',
    formatter: (_row, _column, cellValue) => {
      return cellValue ?? '-';
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
    width: 100,
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
  shop_name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
  client_id: [{ required: true, message: '请输入店铺 Client', trigger: 'blur' }],
  client_secret: [{ required: true, message: '请输入店铺 Client Secret', trigger: 'blur' }],
  brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
  max_limit: [
    {
      type: 'number',
      message: '请输入数字',
      trigger: 'blur'
    },
    {
      asyncValidator: (_rule, value) => {
        return new Promise((resolve, reject) => {
          if (value === undefined || value === null) {
            resolve();
          } else if (value < 1) {
            reject('上架最大限制数量不能小于1');
          } else {
            resolve();
          }
        });
      },
      trigger: 'blur'
    }
  ],
  daily_limit: [
    {
      required: true,
      message: '请输入每日上架限制数量',
      trigger: 'blur'
    },
    {
      type: 'number',
      message: '请输入数字',
      trigger: 'blur'
    },
    {
      asyncValidator: (_rule, value) => {
        return new Promise((resolve, reject) => {
          if (value < 1) {
            reject('每日上架限制数量不能小于1');
          } else if (value > 5000) {
            reject('每日上架限制数量不能大于5000');
          } else {
            resolve();
          }
        });
      },
      trigger: 'blur'
    }
  ]
};

export const handleColumns: HandleColumnProps[] = [
  {
    label: '新增店铺',
    type: 'primary',
    key: 'create'
  }
];
