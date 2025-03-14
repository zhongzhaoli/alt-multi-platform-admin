import { FormRules } from 'element-plus';

export const creditCardRules: FormRules = {
  card_number: [
    {
      required: true,
      message: '请输入卡号',
      trigger: 'blur'
    },
    {
      pattern: /^\d{16}$/,
      message: '请输入16位卡号',
      trigger: 'blur'
    }
  ],
  cvv: [
    {
      required: true,
      message: '请输入cvv',
      trigger: 'blur'
    },
    {
      pattern: /^\d{3}$/,
      message: '请输入3位cvv',
      trigger: 'blur'
    }
  ],
  card_lifespan: [
    {
      required: true,
      message: '请输入信用卡有效期',
      trigger: 'blur'
    },
    {
      pattern: /^\d{2}\/\d{2}$/,
      message: '请输入正确的信用卡有效期',
      trigger: 'blur'
    }
  ]
};

export const bindAccountRules: FormRules = {
  card_email: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: 'blur'
    },
    {
      type: 'email',
      message: '请输入正确的邮箱',
      trigger: 'blur'
    }
  ],
  email_pwd: [
    {
      required: true,
      message: '请输入亚马逊密码',
      trigger: 'blur'
    }
  ],
  card_phone: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    },
    {
      pattern: /^1[3456789]\d{9}$/,
      message: '请输入正确的手机号',
      trigger: 'blur'
    }
  ]
};

export const orderInfoRules: FormRules = {
  pay_amount: [
    {
      required: true,
      message: '请输入支付金额',
      trigger: 'blur'
    },
    {
      pattern: /^\d+(\.\d{1,2})?$/,
      message: '请输入正确的金额',
      trigger: 'blur'
    },
    {
      validator: (_rule, value, callback) => {
        console.log(value);
        if (value <= 0) {
          callback(new Error('订单金额必须大于0'));
        }
        return true;
      },
      trigger: 'blur'
    }
  ],
  card_status: [
    {
      required: true,
      message: '请选择信用卡存活状态',
      trigger: 'change'
    }
  ],
  status: [
    {
      required: true,
      message: '请选择订单状态',
      trigger: 'change'
    }
  ],
  fail_remark: [
    {
      required: true,
      message: '请选择失败原因',
      trigger: 'blur'
    }
  ]
};
