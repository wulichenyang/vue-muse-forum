import { Commit, Dispatch } from "vuex"
import * as types from "../mutation-types"

import Vue from 'vue'


export interface State {
  // 是否正在请求数据
  ifLoading: boolean
}

const initState: State = {
  // 是否正在请求数据
  ifLoading: true
}

// getters
const getters = {
  // 是否正在请求数据
  ifLoading: (state: State) => {
    return state.ifLoading
  },

}


// actions
const actions = {

  // 打开 loading
  openLoading(context: { dispatch: Dispatch, commit: Commit; state: State }) {
    context.commit(types.OPEN_LOADING)
  },
  
  // 关闭 loading
  closeLoading(context: { dispatch: Dispatch, commit: Commit; state: State }) {
    context.commit(types.CLOSE_LOADING)
  }
}


// mutations
const mutations = {
  
  // 打开 loading
  [types.OPEN_LOADING](state: State) {
    state.ifLoading = true
  },
  
  // 关闭 loading
  [types.CLOSE_LOADING](state: State) {
   state.ifLoading = false
  },


}


export default {
  state: initState,
  getters,
  actions,
  mutations,
}