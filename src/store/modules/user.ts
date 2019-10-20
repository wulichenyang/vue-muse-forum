import { Commit, Dispatch } from "vuex"
// import shop from '../../api'
import * as types from "../mutation-types"
// import { CartProduct, CheckoutStatus, AddToCartPayload } from "../index"
import { fetchUserself, fetchOtherUser } from '@/api/user';
import To from '@/utils/to'
import {
  UserDetail,
  OtherUserDetail
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
  openLoginDialog: boolean,
  otherUserMap: OtherUserMap
}

export interface OtherUserMap {
  [userId: string]: OtherUserDetail
}

const initState: State = {
  userDetail: null,
  isLogin: null,
  openLoginDialog: false,
  otherUserMap: <OtherUserMap>{}
}

// getters
const getters = {
  userDetail: (state: State) => state.userDetail,
  isLogin: (state: State) => state.isLogin,
  openLoginDialog: (state: State) => state.openLoginDialog,
  otherUserDetail: (state: State) => (userId: string) => state.otherUserMap[userId],
}

// actions
const actions = {
  // 获取任意用户信息
  async getOtherUserDetail(context: { dispatch: Dispatch, commit: Commit; state: State }, userId: string) {
    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchOtherUser(userId));
    if (err) {
      // 获取失败
      return false
    }
    if (res && res.code === 0) {
      // 获取成功
      context.dispatch('setOtherUser', res.data.userinfo as OtherUserDetail)
      return true
    }
  },

  // 获取用户自身信息
  async getUser(context: { dispatch: Dispatch, commit: Commit; state: State }) {
    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchUserself());
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

  // 设置用户自身信息
  setUser(context: { commit: Commit; state: State }, payload: UserDetail) {
    context.commit(types.SET_USER_LOGIN)
    context.commit(types.SET_USER_DETAIL, (payload as UserDetail))
  },

  // 其他用户信息加入map
  setOtherUser(context: { commit: Commit; state: State }, payload: OtherUserDetail) {
    context.commit(types.SET_OTHER_USER_DETAIL, (payload as OtherUserDetail))
  },

  // 清除用户信息和登录信息
  clearUser(context: { commit: Commit; state: State }) {
    context.commit(types.CLEAR_USER_LOGIN)
    context.commit(types.CLEAR_USER_DETAIL)
  },
  addUserPostCount(context: { commit: Commit; state: State }) {
    context.commit(types.ADD_USER_POST_COUNT)
  },
  // 开关 login 对话框
  openLoginDialog(context: { commit: Commit; state: State }) {
    context.commit(types.OPEN_LOGIN_DIALOG)
  },

  closeLoginDialog(context: { commit: Commit; state: State }) {
    context.commit(types.CLOSE_LOGIN_DIALOG)
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
  // 设置用户自身信息
  [types.SET_USER_DETAIL](state: State, payload: UserDetail) {
    // 对象直接赋值不行，需要解构赋值？// TODO: fix
    state.userDetail = {
      ...payload
    }
  },

  // 其他用户信息加入map
  [types.SET_OTHER_USER_DETAIL](state: State, payload: OtherUserDetail) {
    state.otherUserMap = {
      ...state.otherUserMap,
      [payload._id]: {
        ...payload
      }
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
  [types.ADD_USER_POST_COUNT](state: State) {
    state.userDetail = {
      ...(state.userDetail as UserDetail),
      postCount: (state.userDetail as UserDetail).postCount + 1
    }
  },
  [types.OPEN_LOGIN_DIALOG](state: State) {
    state.openLoginDialog = true;
  },
  [types.CLOSE_LOGIN_DIALOG](state: State) {
    state.openLoginDialog = false;
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}