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
      pattern: /^\d{2}\/\d{4}$/,
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
