import { FormRules } from 'element-plus';
import { HandleColumnProps, type TableColumnProps } from 'tsx-element-table/src/types';

export const tableColumns: TableColumnProps[] = [
  {
    label: 'ID',
    align: 'center',
    width: 140,
    prop: 'id'
  },
  {
    label: '店铺ID',
    prop: 'shop_id',
    align: 'center',
    width: 200,
    showOverflowTooltip: true
  },
  {
    label: '店铺名称',
    prop: 'shop_name',
    minWidth: 200,
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '店铺存活状态',
    align: 'center',
    width: 160,
    prop: 'shop_survival'
  },
  {
    label: 'App Key',
    prop: 'app_key',
    align: 'center',
    width: 160
  },
  {
    label: 'App Secret',
    prop: 'app_secret',
    align: 'center',
    width: 160
  },
  {
    label: '创建时间',
    align: 'center',
    prop: 'created_at',
    minWidth: 160
  },
  {
    label: '操作',
    width: '120',
    align: 'center',
    fixed: 'right',
    prop: 'handle'
  }
];

export const handleColumns: HandleColumnProps[] = [
  {
    label: '新增店铺',
    type: 'primary',
    key: 'create'
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
