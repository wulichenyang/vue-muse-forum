import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import Toast from 'muse-ui-toast';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';
// 解决muse-ui的icon在移动端不能显示问题
import '@/assets/css/material-icons.css'
// 配置muse-ui主题
import { museThemeConfig } from '@/config/index'
import theme from 'muse-ui/lib/theme';
theme.add('muse-pink', // light.js
  museThemeConfig, 'light');
theme.use('muse-pink');

Vue.use(MuseUI);
Vue.use(Toast, {
  position: 'top', // 显示位置
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
