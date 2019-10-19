import { Commit, Dispatch } from "vuex"
import * as types from "../mutation-types"
import {

} from '@/api/comment';
import To from '@/utils/to'
import {
  CommentDetail,
  ReplyDetail,
  CommentRawDetail
} from '@/assets/js/dataType'
import {
  toggleLike,
  LikeTargetType,
} from "@/api/like"
import Vue from 'vue'

export interface CommentDetailMap {
  [commentId: string]: CommentDetail
}

export interface State {
  commentDetailMap: CommentDetailMap
}

const initState: State = {
  commentDetailMap: <CommentDetailMap>{}
}


// 获取comment的reply中的ids
const getReplyIds = (commentRawDetail: CommentRawDetail): string[] => {
  return commentRawDetail.reply.map(reply => reply._id)
}

// 转换函数，返回提取reply中的ids的commets
const absorbReplyIds = (commentRawDetails: Array<CommentRawDetail>): Array<CommentDetail> => {
  return commentRawDetails.map((commentRawDetail: CommentRawDetail) => ({
    ...commentRawDetail,
    reply: commentRawDetail.reply.map(replyDetail => replyDetail._id)
  }))
}

// 转换函数，提取所有replyDetails
const absorbReplies = (commentRawDetails: Array<CommentRawDetail>): Array<ReplyDetail> => {
  let replies: Array<ReplyDetail> = [];
  commentRawDetails.forEach((commentRawDetail: CommentRawDetail) => {
    replies = [
      ...replies,
      ...commentRawDetail.reply
    ]
  })
  return replies;
}

// getters
const getters = {

  // 获取某个评论详细内容
  commentDetail: (state: State) => (commentId: string) => {
    if (!state.commentDetailMap[commentId]) {
      state.commentDetailMap[commentId] = <CommentDetail>{}
    }
    return state.commentDetailMap[commentId]
  },
}

// actions
const actions = {

  // 添加一条评论
  addCommentToCommentMap(context: { dispatch: Dispatch, commit: Commit; state: State }, commentRawDetail: CommentRawDetail) {
    context.state.commentDetailMap[commentRawDetail._id] = {
      ...commentRawDetail,
      reply: getReplyIds(commentRawDetail)
    }
  },

  // 添加一条回复(id)
  addReplyToCommentMap(context: { dispatch: Dispatch, commit: Commit; state: State }, replyDetail: ReplyDetail) {
    context.commit(types.ADD_REPLY_ID_TO_COMMENT_DETAIL_MAP, replyDetail as ReplyDetail)
    // 添加一条回复到replyDetailMap
    context.dispatch('addReplyToReplyMap', replyDetail)
  },

  // 添加评论集
  async addCommentsToCommentMap(context: { dispatch: Dispatch, commit: Commit; state: State }, commentRawDetails: Array<CommentRawDetail>) {
    context.commit(types.ADD_COMMENTS_TO_COMMENT_MAP, absorbReplyIds(commentRawDetails))
    // 添加回复集
    context.dispatch('addRepliesToReplyMap', absorbReplies(commentRawDetails))
    return true
  },

  // 修改评论是否点赞
  async toggleCommentLike(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { targetId: string, type: LikeTargetType }) {
    // 点赞
    const {
      targetId,
      type,
    } = payload

    context.commit(types.TOGGLE_COMMENT_LIKE, { targetId })

    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(toggleLike({ targetId, type }));

    // 更新失败
    if (err) {
      // 取消点赞行为
      context.commit(types.TOGGLE_COMMENT_LIKE, { targetId })
      return false
    }

    if (res && res.code === 0) {
      return true
    }
  },
}

// mutations
const mutations = {
  // 添加评论到 commentDetailMap
  [types.ADD_COMMENTS_TO_COMMENT_MAP](state: State, commentDetails: Array<CommentDetail>) {
    commentDetails.map(commentDetail => {
      state.commentDetailMap[commentDetail._id] = {
        ...commentDetail
      }
    })
  },

  // 添加一条回复 id 到 commentDetailMap
  [types.ADD_REPLY_ID_TO_COMMENT_DETAIL_MAP](state: State, replyDetail: ReplyDetail) {
    state.commentDetailMap = {
      ...state.commentDetailMap,
      [replyDetail.commentId]: {
        ...state.commentDetailMap[replyDetail.commentId],
        reply: [
          ...state.commentDetailMap[replyDetail.commentId].reply,
          replyDetail._id
        ]
      }
    }
  },

  // 修改评论项是否点赞
  [types.TOGGLE_COMMENT_LIKE](state: State, payload: { targetId: string }) {
    const {
      targetId
    } = payload;

    let ifLikeBefore = state.commentDetailMap[targetId].ifLike;
    let beforeLikeCount = state.commentDetailMap[targetId].likeCount;

    state.commentDetailMap = {
      ...state.commentDetailMap,
      [targetId]: {
        ...state.commentDetailMap[targetId],
        likeCount: ifLikeBefore ? --beforeLikeCount : ++beforeLikeCount,
        ifLike: !(ifLikeBefore)
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