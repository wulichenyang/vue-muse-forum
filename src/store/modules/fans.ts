import { Commit, Dispatch } from "vuex"
import * as types from "../mutation-types"
import To from '@/utils/to'
import {
  UserFansBrief,
} from '@/assets/js/dataType'
import {
  fetchFansOfOtherUser,
  FollowPayload,
  toggleFollow
} from "@/api/follow"
import Vue from 'vue'

export interface UserToFansMap {
  [userId: string]: UserToFans
}

export interface UserFansBriefMap {
  [fansId: string]: UserFansBrief
}

export interface UserToFans {
  userFansBriefMap: UserFansBriefMap,
  fansIds: string[],
}

export interface State {
  userToFanMap: UserToFansMap,
}

const initState: State = {
  // 各个用户下的粉丝map
  userToFanMap: <UserToFansMap>{},
}

// getters
const getters = {

  
  // 某用户下的粉丝列表map
  userFanMap: (state: State) => (userId: string) => {
    // 动态属性需要手动初始化，防止第一次渲染不更新数据
    if (!state.userToFanMap[userId]) {
      Vue.set(state.userToFanMap, userId, {});
    } 
    return state.userToFanMap[userId].userFansBriefMap
  },

  // 某用户下的粉丝ids
  userFanIds: (state: State) => (userId: string) => {
    // 动态属性需要手动初始化，防止第一次渲染不更新数据
    // 初始化 userToFanMap 里对应id的映射对象
    if (!state.userToFanMap[userId]) {
      Vue.set(state.userToFanMap, userId, {});
    }
    if (!state.userToFanMap[userId].fansIds) {
      Vue.set(state.userToFanMap[userId], 'fansIds', []);
    }
    return (state.userToFanMap[userId]).fansIds
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
        userFansBriefMap[x._id] = x;
        return x._id
      });

      context.commit(types.SET_USER_FANS_IDS, { userId, fansIds })
      context.commit(types.ADD_USER_FANS_TO_BRIEF_MAP, { userId, userFansBriefMap })
      return true
    }
  },
}


// mutations
const mutations = {

  // 添加某用户下粉丝列表
  [types.ADD_USER_FANS_TO_BRIEF_MAP](state: State, payload: { userId: string, userFansBriefMap: UserFansBriefMap }) {
    // 初始化对象
    if (!state.userToFanMap[payload.userId]) {
      state.userToFanMap[payload.userId] = <UserToFans>{}
    }

    state.userToFanMap[payload.userId].userFansBriefMap =
      payload.userFansBriefMap
  },

  // 添加某用户下粉丝列表 ids
  [types.SET_USER_FANS_IDS](state: State, payload: { userId: string, fansIds: string[] }) {
    // 初始化对象
    if (!state.userToFanMap[payload.userId]) {
      state.userToFanMap[payload.userId] = <UserToFans>{}
    }

    state.userToFanMap[payload.userId].fansIds = payload.fansIds

  },

}


export default {
  state: initState,
  getters,
  actions,
  mutations,
}