import { Commit, Dispatch } from "vuex"
import * as types from "../mutation-types"
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
import { fetchCommentsOfOtherUser } from '@/api/comment'
import Vue from 'vue'

export interface CommentDetailMap {
  [commentId: string]: CommentDetail
}

export interface UserToCommentMap {
  [userId: string]: UserToComment
}

// 糟糕的设计，commentDetailMap 应该放在全局共享
export interface UserToComment {
  commentDetailMap: CommentDetailMap,
  commentIds: string[],
}

export interface State {
  userToCommentMap: UserToCommentMap,
  commentDetailMap: CommentDetailMap
}

const initState: State = {
  // 各个用户下的评论map（不含reply）
  userToCommentMap: <UserToCommentMap>{},
  // post里详细评论map（含reply）
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

  // 在分类下的文章里获取某个评论详细内容
  commentDetail: (state: State) => (commentId: string) => {
    if (!state.commentDetailMap[commentId]) {
      state.commentDetailMap[commentId] = <CommentDetail>{}
    }
    return state.commentDetailMap[commentId]
  },

  // 某用户下的评论列表map
  userCommentMap: (state: State) => (userId: string) => {
    // 动态属性需要手动初始化，防止第一次渲染不更新数据
    if (!state.userToCommentMap[userId]) {
      Vue.set(state.userToCommentMap, userId, {});
    }
    return state.userToCommentMap[userId].commentDetailMap
  },

  // 某用户下的评论ids
  userCommentIds: (state: State) => (userId: string) => {
    // 动态属性需要手动初始化，防止第一次渲染不更新数据
    // 初始化 userToCommentMap 里对应id的映射对象
    if (!state.userToCommentMap[userId]) {
      Vue.set(state.userToCommentMap, userId, {});
    }
    if (!state.userToCommentMap[userId].commentIds) {
      Vue.set(state.userToCommentMap[userId], 'commentIds', []);
    }
    return (state.userToCommentMap[userId]).commentIds
  },
}

// actions
const actions = {

  // 在分类下的文章里添加一条评论
  addCommentToCommentMap(context: { dispatch: Dispatch, commit: Commit; state: State }, commentRawDetail: CommentRawDetail) {
    context.state.commentDetailMap[commentRawDetail._id] = {
      ...commentRawDetail,
      reply: getReplyIds(commentRawDetail)
    }
  },

  // 在分类下的文章里添加一条回复(id)
  addReplyToCommentMap(context: { dispatch: Dispatch, commit: Commit; state: State }, replyDetail: ReplyDetail) {
    context.commit(types.ADD_REPLY_ID_TO_COMMENT_DETAIL_MAP, replyDetail as ReplyDetail)
    // 添加一条回复到replyDetailMap
    context.dispatch('addReplyToReplyMap', replyDetail)
  },

  // 在分类下的文章里添加评论集
  async addCommentsToCommentMap(context: { dispatch: Dispatch, commit: Commit; state: State }, commentRawDetails: Array<CommentRawDetail>) {
    context.commit(types.ADD_COMMENTS_TO_COMMENT_MAP, absorbReplyIds(commentRawDetails))
    // 在分类下的文章里添加回复集
    context.dispatch('addRepliesToReplyMap', absorbReplies(commentRawDetails))
    return true
  },

  // 在分类下的文章里修改评论是否点赞
  async toggleCommentLike(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { targetId: string, type: LikeTargetType, authorId: string }) {
    // 点赞
    const {
      targetId,
      type,
      authorId
    } = payload

    // 在分类下的文章里修改评论是否点赞
    context.commit(types.TOGGLE_COMMENT_LIKE, { targetId })
    // 在某用户下的评论列表里修改评论是否点赞
    context.commit(types.TOGGLE_USER_COMMENT_LIKE, { targetId, authorId })

    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(toggleLike({ targetId, type, authorId }));

    // 更新失败
    if (err) {
      // 在分类下的文章里的评论取消是否点赞
      context.commit(types.TOGGLE_COMMENT_LIKE, { targetId })
      // 在某用户下的评论列表里修改评论是否点赞
      context.commit(types.TOGGLE_USER_COMMENT_LIKE, { targetId, authorId })
      return false
    }

    if (res && res.code === 0) {
      return true
    }
  },


  // 在某用户下的评论列表里修改评论是否点赞
  async toggleUserCommentLike(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { targetId: string, type: LikeTargetType, authorId: string }) {
    // 点赞
    const {
      targetId,
      type,
      authorId
    } = payload

    // 在分类下的文章里修改评论是否点赞
    context.commit(types.TOGGLE_COMMENT_LIKE, { targetId })
    // 在某用户下的评论列表里修改评论是否点赞
    context.commit(types.TOGGLE_USER_COMMENT_LIKE, { targetId, authorId })

    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(toggleLike({ targetId, type, authorId }));

    // 更新失败
    if (err) {
      // 在分类下的文章里的评论取消是否点赞
      context.commit(types.TOGGLE_COMMENT_LIKE, { targetId })
      // 在某用户下的评论列表里修改评论是否点赞
      context.commit(types.TOGGLE_USER_COMMENT_LIKE, { targetId, authorId })

      return false
    }

    if (res && res.code === 0) {
      return true
    }
  },


  // 获取某用户的评论列表信息
  async getUserCommentList(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { userId: string, loginUserId?: string }) {
    const { userId, loginUserId } = payload;
    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchCommentsOfOtherUser(userId, loginUserId));

    // 获取失败
    if (err) {
      context.dispatch('closeLoading')
      return false
    }

    if (res && res.code === 0) {
      // 获取成功
      let commentDetailMap: CommentDetailMap = {};
      let commentIds: string[] = (res.data as Array<CommentDetail>).map((x: CommentDetail) => {
        commentDetailMap[x._id] = x;
        return x._id
      });

      context.commit(types.SET_USER_COMMENT_IDS, { userId, commentIds })
      context.commit(types.ADD_USER_COMMENT_TO_BRIEF_MAP, { userId, commentDetailMap })
      context.dispatch('closeLoading')
      return true
    }
  },
}

// mutations
const mutations = {
  // 在分类下的文章里添加评论到 commentDetailMap
  [types.ADD_COMMENTS_TO_COMMENT_MAP](state: State, commentDetails: Array<CommentDetail>) {
    commentDetails.map(commentDetail => {
      state.commentDetailMap[commentDetail._id] = {
        ...commentDetail
      }
    })
  },

  // 在分类下的文章里添加一条回复 id 到 commentDetailMap
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

  // 在分类下的文章里修改评论项是否点赞
  [types.TOGGLE_COMMENT_LIKE](state: State, payload: { targetId: string }) {
    const {
      targetId
    } = payload;

    // 有缓存，则修改
    if (state.commentDetailMap[targetId]) {
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
    }
  },

  // 在某用户下的某评论是否点赞
  [types.TOGGLE_USER_COMMENT_LIKE](state: State, payload: { targetId: string, authorId: string }) {
    const {
      targetId,
      authorId
    } = payload;

    // 有缓存，则修改
    if (state.userToCommentMap[authorId] &&
      state.userToCommentMap[authorId].commentDetailMap && state.userToCommentMap[authorId].commentDetailMap[targetId]
    ) {
      let ifLikeBefore = state.userToCommentMap[authorId].commentDetailMap[targetId].ifLike;
      let beforeLikeCount = state.userToCommentMap[authorId].commentDetailMap[targetId].likeCount;

      state.userToCommentMap = {
        ...state.userToCommentMap,
        [authorId]: {
          ...state.userToCommentMap[authorId],
          commentDetailMap: {
            ...state.userToCommentMap[authorId].commentDetailMap,
            [targetId]: {
              ...state.userToCommentMap[authorId].commentDetailMap[targetId],
              likeCount: ifLikeBefore ? --beforeLikeCount : ++beforeLikeCount,
              ifLike: !(ifLikeBefore)
            }
          }
        }
      }
    }
  },


  // 添加某用户下评论列表
  [types.ADD_USER_COMMENT_TO_BRIEF_MAP](state: State, payload: { userId: string, commentDetailMap: CommentDetailMap }) {
    // 初始化对象
    if (!state.userToCommentMap[payload.userId]) {
      state.userToCommentMap[payload.userId] = <UserToComment>{}
    }

    state.userToCommentMap[payload.userId].commentDetailMap =
      payload.commentDetailMap
  },

  // 添加某用户下评论列表 ids
  [types.SET_USER_COMMENT_IDS](state: State, payload: { userId: string, commentIds: string[] }) {
    // 初始化对象
    if (!state.userToCommentMap[payload.userId]) {
      state.userToCommentMap[payload.userId] = <UserToComment>{}
    }

    state.userToCommentMap[payload.userId].commentIds = payload.commentIds

  },

}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}