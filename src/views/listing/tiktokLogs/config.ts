import { FilterColumnProps } from '@/components/FilterContainer/types';
import { ElTag } from 'element-plus';
import { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

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
    minWidth: 140,
    showOverflowTooltip: true,
    align: 'center'
  },
  {
    label: '日期',
    prop: 'created_date',
    minWidth: 140,
    showOverflowTooltip: true,
    align: 'center'
  },
  {
    label: '类目名称',
    prop: 'category_name',
    minWidth: 180,
    showOverflowTooltip: true,
    align: 'center'
  },
  {
    label: '提交Asin',
    prop: 'submit_asin_quantity',
    width: 120,
    showOverflowTooltip: true,
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    align: 'center'
  },
  {
    label: '提交Pasin',
    prop: 'submit_pasin_quantity',
    width: 120,
    showOverflowTooltip: true,
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    align: 'center'
  },
  {
    label: 'Pasin成功',
    prop: 'pasin_successes_quantity',
    width: 120,
    showOverflowTooltip: true,
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    align: 'center'
  },
  {
    label: 'Pasin为空',
    prop: 'quantity_is_empty',
    width: 100,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return cellValue === 1
        ? h(ElTag, { disableTransitions: true, type: 'danger' }, () => '是')
        : h(ElTag, { disableTransitions: true, type: 'success' }, () => '否');
    }
  },
  {
    label: 'Pasin不足',
    prop: 'insufficient_quantity',
    width: 100,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return cellValue === 1
        ? h(ElTag, { disableTransitions: true, type: 'danger' }, () => '是')
        : h(ElTag, { disableTransitions: true, type: 'success' }, () => '否');
    }
  },
  {
    label: '图片问题',
    prop: 'image_problems_quantity',
    width: 120,
    showOverflowTooltip: true,
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    align: 'center'
  },
  {
    label: '类目问题',
    prop: 'category_problems_quantity',
    width: 120,
    showOverflowTooltip: true,
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    align: 'center'
  },
  {
    label: '属性问题',
    prop: 'attribute_problems_quantity',
    width: 120,
    showOverflowTooltip: true,
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    align: 'center'
  },
  {
    label: '创建产品问题',
    prop: 'create_product_problems_quantity',
    width: 130,
    showOverflowTooltip: true,
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    align: 'center'
  },
  {
    label: '发布产品问题',
    prop: 'publish_product_problems_quantity',
    width: 130,
    showOverflowTooltip: true,
    sortable: 'custom',
    sortOrders: ['descending', 'ascending', null],
    align: 'center'
  }
];
