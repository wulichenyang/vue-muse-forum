import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index';
import Toast from 'muse-ui-toast';
import MuseUI from 'muse-ui';
import 'muse-ui/dist/muse-ui.css';

Vue.use(MuseUI);
Vue.use(Toast, {
  position: 'top',                  // 显示位置
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
