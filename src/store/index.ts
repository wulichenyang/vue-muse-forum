import Vue from 'vue';
import Vuex from 'vuex';
import user from '@/store/modules/user'
import category from '@/store/modules/category'
import post from '@/store/modules/post'
import comment from '@/store/modules/comment'
import reply from '@/store/modules/reply'
import fans from '@/store/modules/fans'
import loading from '@/store/modules/loading'

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
    comment,
    reply,
    fans,
    loading,
  }
});
