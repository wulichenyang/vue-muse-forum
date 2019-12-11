// bind polyfill 兼容IE8
// import "@babel/polyfill"; // 会自动引用

// 解决IE9不能支持flex
// import "@/assets/js/flexibility.js"
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import Upload from 'element-ui/lib/upload';
import Toast from 'muse-ui-toast';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css'; // muse-ui CSS
import 'muse-ui-loading/dist/muse-ui-loading.css'; // loading CSS
import Loading from 'muse-ui-loading';

// 解决muse-ui的icon在移动端不能显示问题
import '@/assets/css/material-icons.css'

// 配置muse-ui主题
import { museThemeConfig, museLoadingConfig } from '@/config/index'
import theme from 'muse-ui/lib/theme';
theme.add('muse-pink', // light.js
museThemeConfig, 'light');
theme.use('muse-pink');

// 配置loading
Vue.use(Loading, museLoadingConfig)
Vue.use(MuseUI);
Vue.use(Loading);
Vue.use(Toast, {
  position: 'top', // 显示位置
  time: 2000,                       // 显示的时长
  // closeIcon: 'close',               // 关闭的图标
  // close: true,                      // 是否显示关闭按钮
  // successIcon: 'check_circle',      // 成功信息图标
  // infoIcon: 'info',                 // 信息信息图标
  // warningIcon: 'priority_high',     // 提醒信息图标
  // errorIcon: 'warning'              // 错误信息图标
});

// element-ui el-upload组件
Vue.use(Upload);
Vue.config.productionTip = false;

// 富文本编辑器样式
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
