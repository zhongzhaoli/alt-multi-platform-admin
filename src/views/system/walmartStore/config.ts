import {
  type HandleColumnProps,
  type TableColumnProps,
} from "tsx-element-table";
import { FormRules } from "element-plus";

export const tableColumns: TableColumnProps[] = [
  {
    label: "ID",
    align: "center",
    width: "140",
    prop: "id",
  },
  {
    label: "店铺ID",
    align: "center",
    width: "140",
    prop: "shop_id",
  },
  {
    label: "店铺名称",
    prop: "shop_name",
    minWidth: 200,
    align: "center",
  },
  {
    label: "Client",
    prop: "client_id",
    minWidth: 160,
    align: "center",
  },
  {
    label: "Client Secret",
    prop: "client_secret",
    minWidth: 160,
    align: "center",
  },
  {
    label: "创建时间",
    align: "center",
    prop: "created_at",
    minWidth: 160,
  },
  {
    label: "操作",
    width: "120",
    align: "center",
    fixed: "right",
    prop: "handle",
  },
];

export const editFormRules: FormRules = {
  shop_id: [
    {
      required: true,
      message: "店铺ID 不能为空",
      trigger: "blur",
    },
  ],
  shop_name: [{ required: true, message: "请输入店铺名称", trigger: "change" }],
  client_id: [
    { required: true, message: "请输入店铺 Client", trigger: "change" },
  ],
  client_secret: [
    { required: true, message: "请输入店铺 Client Secret", trigger: "change" },
  ],
};

export const handleColumns: HandleColumnProps[] = [
  {
    label: "新增店铺",
    type: "primary",
    key: "create",
  },
];
