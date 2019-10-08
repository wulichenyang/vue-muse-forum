import { Commit, Dispatch } from "vuex"
import * as types from "../mutation-types"
import {

} from '@/api/reply';
import To from '@/utils/to'
import {
  ReplyDetail,
} from '@/assets/js/dataType'
import Vue from 'vue'

export interface ReplyDetailMap {
  [replyId: string]: ReplyDetail
}

export interface State {
  replyDetailMap: ReplyDetailMap
}

const initState: State = {
  replyDetailMap: <ReplyDetailMap>{}
}

// getters
const getters = {

  // 获取某个评论详细内容
  replyDetail: (state: State) => (replyId: string) => {
    if (!state.replyDetailMap[replyId]) {
      state.replyDetailMap[replyId] = <ReplyDetail>{}
    }
    return state.replyDetailMap[replyId]
  },
}

// actions
const actions = {

  // 添加一条回复
  async addReplyToReplyMap(context: { dispatch: Dispatch, commit: Commit; state: State }, replyDetail: ReplyDetail) {
    context.commit(types.ADD_REPLY_TO_REPLY_MAP, (replyDetail as ReplyDetail))
    return true
  },

  // 添加回复集
  async addRepliesToReplyMap(context: { dispatch: Dispatch, commit: Commit; state: State }, replyDetails: Array<ReplyDetail>) {
    context.commit(types.ADD_REPLIES_TO_REPLY_MAP, (replyDetails as Array<ReplyDetail>))
    return true
  },
}

// mutations
const mutations = {

  // 添加回复到 replyDetailMap
  [types.ADD_REPLIES_TO_REPLY_MAP](state: State, replyDetails: Array<ReplyDetail>) {
    replyDetails.map(replyDetail => {
      state.replyDetailMap[replyDetail._id] = {
        ...replyDetail
      }
    })
  },

  // 添加一条回复到 replyDetailMap
  [types.ADD_REPLY_TO_REPLY_MAP](state: State, replyDetail: ReplyDetail) {
    state.replyDetailMap = {
      ...state.replyDetailMap,
      [replyDetail._id]: {
        ...replyDetail
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