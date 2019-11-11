import { Commit, Dispatch } from "vuex"
import * as types from "../mutation-types"
import To from '@/utils/to'
import {
  UserFansBrief, FansInfo,
} from '@/assets/js/dataType'
import {
  fetchFansOfOtherUser,
  FollowPayload,
  toggleFollow,
  FollowTargetType
} from "@/api/follow"
import Vue from 'vue'

export interface UserToFansIdsMap {
  [userId: string]: string[]
}

export interface UserFansBriefMap {
  [fansId: string]: UserFansBrief
}

export interface State {
  userToFansIdsMap: UserToFansIdsMap,
  userFansBriefMap: UserFansBriefMap,
}

const initState: State = {
  // 各个用户下的粉丝map
  userToFansIdsMap: <UserToFansIdsMap>{},
  userFansBriefMap: <UserFansBriefMap>{},
}

// getters
const getters = {


  // 某所有缓存的粉丝列表map
  userFanMap: (state: State) => {
    return state.userFansBriefMap
  },

  // 某用户下的粉丝ids
  userFanIds: (state: State) => (userId: string) => {
    // 动态属性需要手动初始化，防止第一次渲染不更新数据
    if (!state.userToFansIdsMap[userId]) {
      Vue.set(state.userToFansIdsMap, userId, []);
    }
    return (state.userToFansIdsMap[userId])
  },

}


// actions
const actions = {

  // 获取某用户的粉丝列表信息
  async getUserFanList(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { userId: string, loginUserId?: string }) {
    const { userId, loginUserId } = payload;
    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchFansOfOtherUser(userId, loginUserId));

    // 获取失败
    if (err) {
      return false
    }

    if (res && res.code === 0) {
      // 获取成功
      let userFansBriefMap: UserFansBriefMap = {};
      let fansIds: string[] = (res.data as Array<UserFansBrief>).map((x: UserFansBrief) => {
        userFansBriefMap[(x.userId as FansInfo)._id] = x;
        return x.userId._id
      });

      context.commit(types.SET_USER_FANS_IDS, { userId, fansIds })
      context.commit(types.ADD_USER_FANS_TO_BRIEF_MAP, { userFansBriefMap })
      return true
    }
  },

  // 关注/取消 某用户粉丝列表里某粉丝
  async toggleUserFansFollow(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { targetId: string, type: FollowTargetType }) {
    // 关注
    const {
      targetId,
      type,
    } = payload

    // PS：粉丝和用户分开存储，可能重复，需要分开处理

    // 对某粉丝的关注
    context.commit(types.TOGGLE_OTHER_USER_FANS_FOLLOW, { targetId })

    // 对某用户的关注
    context.commit(types.TOGGLE_OTHER_USER_FOLLOW, { targetId })

    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(toggleFollow({ targetId, type }));

    // 更新失败
    if (err) {
      // 取消对某粉丝的关注
      context.commit(types.TOGGLE_OTHER_USER_FANS_FOLLOW, { targetId })

      // 取消对某用户的关注
      context.commit(types.TOGGLE_OTHER_USER_FOLLOW, { targetId })
      return false
    }

    if (res && res.code === 0) {
      return true
    }
  }
}


// mutations
const mutations = {

  // 添加粉丝列表
  [types.ADD_USER_FANS_TO_BRIEF_MAP](state: State, payload: { userFansBriefMap: UserFansBriefMap }) {
    state.userFansBriefMap = {
      ...state.userFansBriefMap,
      ...payload.userFansBriefMap
    }
  },

  // 添加某用户下粉丝列表 ids
  [types.SET_USER_FANS_IDS](state: State, payload: { userId: string, fansIds: string[] }) {
    state.userToFansIdsMap[payload.userId] = payload.fansIds

  },

  // 修改对某用户是否关注
  [types.TOGGLE_OTHER_USER_FANS_FOLLOW](state: State, payload: { targetId: string }) {
    const {
      targetId,
    } = payload;

    // 有缓存则修改
    if (state.userFansBriefMap[targetId] && state.userFansBriefMap[targetId]._id) {
      let ifFollowBefore = state.userFansBriefMap[targetId].ifFollow;

      state.userFansBriefMap = {
        ...state.userFansBriefMap,
        [targetId]: {
          ...state.userFansBriefMap[targetId],
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