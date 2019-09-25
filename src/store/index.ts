import Vue from 'vue';
import Vuex from 'vuex';
import user from '@/store/modules/user'
import category from '@/store/modules/category'
import post from '@/store/modules/post'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {

  },
  mutations: {

  },
  actions: {

  },
  modules: {
    user,
    category,
    post,
  }
});
