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
    prop: "shopId",
  },
  {
    label: "Partner ID",
    align: "center",
    width: "140",
    prop: "shopPartnerId",
  },
  {
    label: "店铺名称",
    prop: "shopName",
    minWidth: 200,
    align: "center",
  },
  {
    label: "Client",
    prop: "client",
    minWidth: 160,
    align: "center",
  },
  {
    label: "Client Secret",
    prop: "clientSecret",
    minWidth: 160,
    align: "center",
  },
  {
    label: "创建时间",
    align: "center",
    prop: "createTime",
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
  shopId: [
    {
      required: true,
      message: "店铺ID 不能为空",
      trigger: "blur",
    },
    {
      pattern: /^\d{8,10}$/,
      message: "店铺ID 必须是 8-10位",
      trigger: "blur",
    },
  ],
  shopPartnetId: [
    { required: true, message: "请输入Partner ID", trigger: "change" },
  ],
  shopName: [{ required: true, message: "请输入店铺名称", trigger: "change" }],
  client: [{ required: true, message: "请输入店铺 Client", trigger: "change" }],
  clientSecret: [
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
