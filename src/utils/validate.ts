
// 用户
export const nicknameRules: any = [
  { validate: (val: string) => !!val, message: "必须填写昵称" },
  {
    validate: (val: string) => {
      return val.trim().length < 8;
    },
    message: "昵称长度不超过七个字符"
  }
];
export const phoneRules: any = [
  { validate: (val: string) => !!val, message: "必须填写手机号" },
  {
    validate: (val: string) => {
      const phoneTest = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      return phoneTest.test(val.trim());
    },
    message: "手机号格式不正确"
  }
];
export const emailRules: any = [
  { validate: (val: string) => !!val, message: "必须填写邮箱号" },
  {
    validate: (val: string) => {
      const emailTest = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
      return emailTest.test(val.trim());
    },
    message: "邮箱号格式不正确"
  }
];
export const passwordRules: any = [
  { validate: (val: string) => !!val, message: "必须填写密码" },
  {
    validate: (val: string) => val.length > 3 && val.length < 18,
    message: "密码长度大于3小于18"
  }
];


// 文章分类
export const categoryNameRules: any = [
  { validate: (val: string) => !!val, message: "请填写分类名" },
  {
    validate: (val: string) => {
      return val.trim().length < 6;
    },
    message: "分类名长度不超过5个字符"
  }
];

export const categoryBriefRules: any = [
  { validate: (val: string) => !!val, message: "请填写分类简介" },
  {
    validate: (val: string) => {
      return val.trim().length < 301;
    },
    message: "分类简介长度不超过300个字符"
  }
];

// 个性签名
export const userBriefRules: any = [
  {
    validate: (val: string) => {
      return val.trim().length < 71;
    },
    message: "个性签名长度不超过70个字符"
  }
];

// 文章
export const postTitleRules: any = [
  { validate: (val: string) => !!val, message: "请填写标题" },
  {
    validate: (val: string) => {
      return val.trim().length < 31;
    },
    message: "标题长度不超过30个字符"
  }
];

// 纯文字编辑框
export const commentRules: any = (title: string) => [
  { validate: (val: string) => !!val, message: `请填写${title}` },
  {
    validate: (val: string) => {
      return val.trim().length < 501;
    },
    message: `${title}长度不超过500个字符`
  }
];