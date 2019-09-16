import { Commit, Dispatch } from "vuex"
// import shop from '../../api'
import * as types from "../mutation-types"
// import { CartProduct, CheckoutStatus, AddToCartPayload } from "../index"
import { fetchUser } from '@/api/user';
import To from '@/utils/to'
import {
  UserDetail
} from '@/assets/js/dataType'

export interface PhoneAccountPayload {
  phone: string,
  password: string
}

export interface EmailAccountPayload {
  email: string,
  password: string
}

export interface State {
  userDetail: UserDetail | null;
  isLogin: boolean | null;
}

const initState: State = {
  userDetail: null,
  isLogin: null,
}

// getters
const getters = {
  userDetail: (state: State) => state.userDetail,
  isLogin: (state: State) => state.isLogin
}

// actions
const actions = {
  async getUser(context: { dispatch: Dispatch, commit: Commit; state: State }) {
    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchUser());
    if (err) {
      // 登录失败 清除用户信息和登录信息
      context.dispatch('clearUser')
      return false
    }
    if (res && res.code === 0) {
      // 登录成功 保存用户信息和登录信息
      context.dispatch('setUser', res.data.userinfo as UserDetail)
      return true
    }
  },
  setUser(context: { commit: Commit; state: State }, payload: UserDetail) {
    context.commit(types.SET_USER_LOGIN)
    context.commit(types.SET_USER_DETAIL, (payload as UserDetail))
  },
  // 清除用户信息和登录信息
  clearUser(context: { commit: Commit; state: State }) {
    context.commit(types.CLEAR_USER_LOGIN)
    context.commit(types.CLEAR_USER_DETAIL)
  },
  // async loginByPhone(context: { commit: Commit; state: State }, payload: PhoneAccountPayload) {
  //   try {
  //     let res: Ajax.AjaxResponse = await loginByPhone(payload.phone, payload.password)
  //     if (res.code === 0) {
  //       // 登录成功 保存token
  //       context.commit(types.ADD_USER_TOKEN, (res.data as UserDetail))
  //       return res.data
  //     }
  //   } catch (error) {
  //       // 登录失败 清除token
  //     context.commit(types.CLEAR_USER_DETAIL)
  //     return false
  //   }
  // },
}

// mutations
const mutations = {
  [types.SET_USER_DETAIL](state: State, payload: UserDetail) {
    console.log(state)
    // 对象直接赋值不行，需要解构赋值？// TODO: fix
    state.userDetail = {
      ...payload
    }
  },
  [types.SET_USER_LOGIN](state: State) {
    state.isLogin = true
  },
  [types.CLEAR_USER_DETAIL](state: State) {
    state.userDetail = null
  },
  [types.CLEAR_USER_LOGIN](state: State) {
    state.isLogin = false
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}