export const ApiConfig = {
  // HOST: "http://192.168.1.167:3001",
  // HOST: `http://localhost:3838`,
  apiPrefix: '/muse-forum-api-v1',
};

export const access_token: string = 'muse_forum_access_token';

export const museThemeConfig: any = {
  primary: '#e91e63',
  secondary: '#424242',
  success: '#4caf50',
  warning: '#fdd835',
  info: '#2196f3',
  error: '#e91e63',
  track: '#bdbdbd',
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'gba(0, 0, 0, 0.54)',
    alternate: '#fff',
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)' // 提示文字颜色
  },
  divider: 'rgba(0, 0, 0, 0.12)',
  background: {
    paper: '#fff',
    chip: '#e0e0e0',
    default: '#fafafa'
  }
}
export const museLoadingConfig: any = {
  overlayColor: 'hsla(0,0%,100%,.7)',        // 背景色
  size: 24,                                  // loading大小
  color: museThemeConfig.primary,            // color
  className: ''                              // loading class name
}

export const qiniuConfig: any = {
  domain: "http://upload-z2.qiniup.com",
  qiniuAddr: "pxyg1giq3.bkt.clouddn.com",
}

export const museColorArray: string[] = [
  // MUSE-UI
  "primary",
  "secondary",
  "success",
  "warning",
  "info",
  "error",
]

export const colorArray: string[] = [
  // MUSE-UI

  // "primary",
  // "secondary",
  // "success",
  // "warning",
  // "info",
  // "error",

  // 三元群
  // '#E91E63',
  // '#ECDD36',
  // '#0590B5',
  // '#9C0537',
  // '#0C7D9C',

  // 单色
  // '#E91E63',
  // '#EC6592',
  // '#B5184C',
  // '#690E2C',
  // '#692D41',

  // 主题1
  '#555555',
  '#80475E',
  '#CC5A71',
  '#C89B7B',
  '#E3E87D',

  // 主题2
  // '#E91E63',
  // '#ffb5b5',
  // '#D0D0D0',
  // '#f0decb',
  // '#C89B7B',

];