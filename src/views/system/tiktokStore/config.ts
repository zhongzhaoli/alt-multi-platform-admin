import { type TableColumnProps } from 'tsx-element-table/src/types';
import { FormRules } from 'element-plus';

export const tableColumns: TableColumnProps[] = [
  {
    label: '#',
    align: 'center',
    type: 'index'
  },
  {
    label: '店铺名称',
    prop: 'seller_name',
    minWidth: '300',
    align: 'center',
    showOverflowTooltip: true
  },
  {
    label: '店铺ID',
    prop: 'shop_id',
    align: 'center',
    minWidth: '300',
    showOverflowTooltip: true
  },
  {
    label: '创建时间',
    align: 'center',
    prop: 'create_time',
    width: '200'
  }
];

export const editFormRules: FormRules = {
  shop_name: [{ required: true, message: '请输入店铺名称', trigger: 'change' }],
  client: [{ required: true, message: '请输入店铺 Client', trigger: 'change' }],
  client_secret: [{ required: true, message: '请输入店铺 Client Secret', trigger: 'change' }]
};
