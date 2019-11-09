import { Commit, Dispatch } from "vuex"
// import shop from '../../api'
import * as types from "../mutation-types"
// import { CartProduct, CheckoutStatus, AddToCartPayload } from "../index"
import { fetchUserself, fetchOtherUser } from '@/api/user';
import {
  FollowPayload,
  FollowTargetType,
  toggleFollow
} from '@/api/follow'
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
  async getOtherUserDetail(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { targetUserId: string, fromUserId?: string }) {
    const {
      targetUserId,
      fromUserId
    } = payload;

    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchOtherUser(targetUserId, fromUserId));
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

  // 对某用户进行关注和取消
  async toggleUserFollow(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { targetId: string, type: FollowTargetType }) {
    // 点赞
    const {
      targetId,
      type,
    } = payload

    // 对某用户的关注
    context.commit(types.TOGGLE_OTHER_USER_FOLLOW, { targetId })

    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(toggleFollow({ targetId, type }));

    // 更新失败
    if (err) {
      // 取消对某用户的关注
      context.commit(types.TOGGLE_OTHER_USER_FOLLOW, { targetId })

      return false
    }

    if (res && res.code === 0) {
      return true
    }
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
    state.userDetail = payload
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

  // 修改对某用户是否关注
  [types.TOGGLE_OTHER_USER_FOLLOW](state: State, payload: { targetId: string }) {
    const {
      targetId,
    } = payload;

    // 有缓存则修改
    if (state.otherUserMap[targetId] && state.otherUserMap[targetId]._id) {
      let ifFollowBefore = state.otherUserMap[targetId].ifFollow;

      state.otherUserMap = {
        ...state.otherUserMap,
        [targetId]: {
          ...state.otherUserMap[targetId],
          ifFollow: !(ifFollowBefore)
        }
      }

    }
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}