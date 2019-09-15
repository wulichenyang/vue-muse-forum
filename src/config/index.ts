export const ApiConfig = {
  // HOST: "http://192.168.1.167:3001",
  // HOST: `http://localhost:3838`,
  apiPrefix: '/muse-forum-api-v1',
};

export const access_token: string = 'muse_forum_access_token';

export const museThemeConfig: object = {
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
