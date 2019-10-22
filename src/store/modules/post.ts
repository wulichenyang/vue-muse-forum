import { Commit, Dispatch } from "vuex"
import * as types from "../mutation-types"
import {
  fetchPostListByCategory,
  fetchPostDetail, 
  fetchPostsOfOtherUser
} from '@/api/post';
import {
  toggleLike,
  LikeTargetType,
  LikePayload
} from "@/api/like"
import To from '@/utils/to'
import {
  PostBrief,
  PostRawDetail,
  PostDetail,
  CommentRawDetail,
  CommentDetail,
  ReplyDetail,
} from '@/assets/js/dataType'
import Vue from 'vue'

export interface PostBriefAllInfo {
  postBriefMap: PostBriefMap,
  postIds: string[],
}

export interface CategoryToPost extends PostBriefAllInfo {

}

export interface UserToPost extends PostBriefAllInfo {

}

export interface CategoryToPostMap {
  [categoryId: string]: CategoryToPost
}

export interface UserToPostMap {
  [userId: string]: UserToPost
}

export interface PostBriefMap {
  [postId: string]: PostBrief
}

export interface PostDetailMap {
  [postId: string]: PostDetail
}

export interface State {
  // 各个文章分类下对应的文章
  categoryToPostMap: CategoryToPostMap,
  // 各个用户所有发布的文章
  userToPostMap: UserToPostMap,
  postDetailMap: PostDetailMap,
}


const initState: State = {
  // 各个文章分类下对应的文章
  categoryToPostMap: <CategoryToPostMap>{},
  // 各个用户所有发布的文章
  userToPostMap: <UserToPostMap>{},
  postDetailMap: <PostDetailMap>{}
}

// 转换函数，提取comments中的ids
const absorbCommentIds = (postRawDetail: PostRawDetail): PostDetail => {
  return {
    ...postRawDetail,
    comment: postRawDetail.comment.map(comment => comment._id)
  }
}

// getters
const getters = {

  // 某分类下的文章列表map
  postBriefMap: (state: State) => (categoryId: string) => {
    // 动态属性需要手动初始化，防止第一次渲染不更新数据
    if (!state.categoryToPostMap[categoryId]) {
      Vue.set(state.categoryToPostMap, categoryId, {});
    }
    // if(!state.categoryToPostMap[categoryId].postBriefMap){
    //   Vue.set(state.categoryToPostMap[categoryId], 'postBriefMap', {});
    // }
    return state.categoryToPostMap[categoryId].postBriefMap
  },

  // 某分类下的文章ids
  postIds: (state: State) => (categoryId: string) => {
    // 动态属性需要手动初始化，防止第一次渲染不更新数据
    // 初始化categoryToPostMap里对应id的映射对象
    if (!state.categoryToPostMap[categoryId]) {
      Vue.set(state.categoryToPostMap, categoryId, {});
    }
    if (!state.categoryToPostMap[categoryId].postIds) {
      Vue.set(state.categoryToPostMap[categoryId], 'postIds', []);
    }
    return (state.categoryToPostMap[categoryId]).postIds
  },

  // 某用户下的文章列表map
  userPostBriefMap: (state: State) => (userId: string) => {
    // 动态属性需要手动初始化，防止第一次渲染不更新数据
    if (!state.userToPostMap[userId]) {
      Vue.set(state.userToPostMap, userId, {});
    }
    // if(!state.userToPostMap[userId].postBriefMap){
    //   Vue.set(state.userToPostMap[userId], 'postBriefMap', {});
    // }
    return state.userToPostMap[userId].postBriefMap
  },

  // 某用户下的文章ids
  userPostIds: (state: State) => (userId: string) => {
    // 动态属性需要手动初始化，防止第一次渲染不更新数据
    // 初始化 userToPostMap 里对应id的映射对象
    if (!state.userToPostMap[userId]) {
      Vue.set(state.userToPostMap, userId, {});
    }
    if (!state.userToPostMap[userId].postIds) {
      Vue.set(state.userToPostMap[userId], 'postIds', []);
    }
    return (state.userToPostMap[userId]).postIds
  },

  // 文章详细信息map
  postDetailMap: (state: State) => {
    return state.postDetailMap
  },

  // 获取某篇文章详细内容
  postDetail: (state: State) => (postId: string) => {
    if (!state.postDetailMap[postId]) {
      state.postDetailMap[postId] = <PostDetail>{}
    }
    return state.postDetailMap[postId]
  },
}

// actions
const actions = {
  // 获取某分类下的文章列表信息
  async getPostList(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { categoryId: string, userId?: string }) {
    const { categoryId, userId } = payload;
    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchPostListByCategory(categoryId, userId));

    // 获取失败
    if (err) {
      return false
    }

    if (res && res.code === 0) {
      // 获取成功
      let postBriefMap: PostBriefMap = {};
      let postIds: string[] = (res.data as Array<PostBrief>).map((x: PostBrief) => {
        postBriefMap[x._id] = x;
        return x._id
      });

      context.commit(types.SET_POST_IDS, { categoryId, postIds })
      context.commit(types.ADD_POST_TO_BRIEF_MAP, { categoryId, postBriefMap })
      return true
    }
  },

  // 获取某用户的文章列表信息
  async getUserPostList(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { userId: string, loginUserId?: string }) {
    const { userId, loginUserId } = payload;
    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchPostsOfOtherUser(userId, loginUserId));

    // 获取失败
    if (err) {
      return false
    }

    if (res && res.code === 0) {
      // 获取成功
      let postBriefMap: PostBriefMap = {};
      let postIds: string[] = (res.data as Array<PostBrief>).map((x: PostBrief) => {
        postBriefMap[x._id] = x;
        return x._id
      });

      context.commit(types.SET_USER_POST_IDS, { userId, postIds })
      context.commit(types.ADD_USER_POST_TO_BRIEF_MAP, { userId, postBriefMap })
      return true
    }
  },

  async getPostDetail(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { postId: string, userId?: string }) {
    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchPostDetail(payload.postId, payload.userId));

    // 获取失败
    if (err) {
      return false
    }

    if (res && res.code === 0) {
      // 获取成功
      context.commit(types.ADD_POST_TO_DETAIL_MAP, absorbCommentIds(res.data as PostRawDetail))
      // 添加所有评论
      context.dispatch('addCommentsToCommentMap', res.data.comment as Array<CommentRawDetail>)
      return true
    }
  },

  // 添加一条comment id
  async addCommentToPostDetail(context: { dispatch: Dispatch, commit: Commit; state: State }, commentRawDetail: CommentRawDetail) {
    context.commit(types.ADD_COMMENT_ID_TO_POST_DETAIL, commentRawDetail)
    // post里评论 + 1
    context.commit(types.ADD_COMMENT_COUNT_IN_POST_DETAIL, commentRawDetail.postId)
    // 添加一条评论
    context.dispatch('addCommentToCommentMap', commentRawDetail)
    return true
  },

  async toggleBriefPostLike(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { targetId: string, type: LikeTargetType, categoryId: string, authorId: string }) {
    // 点赞
    const {
      targetId,
      type,
      categoryId,
      authorId
    } = payload

    context.commit(types.TOGGLE_BRIEF_POST_LIKE, { categoryId, targetId })

    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(toggleLike({ targetId, type, authorId }));

    // 更新失败
    if (err) {
      // 取消点赞行为
      context.commit(types.TOGGLE_BRIEF_POST_LIKE, { categoryId, targetId })
      return false
    }

    if (res && res.code === 0) {
      return true
    }
  },
}

// mutations
const mutations = {
  // 添加某分类下文章列表
  [types.ADD_POST_TO_BRIEF_MAP](state: State, payload: { categoryId: string, postBriefMap: PostBriefMap }) {
    // 初始化对象
    if (!state.categoryToPostMap[payload.categoryId]) {
      state.categoryToPostMap[payload.categoryId] = <CategoryToPost>{}
    }

    state.categoryToPostMap[payload.categoryId].postBriefMap = {
      ...payload.postBriefMap
    }
  },

  // 添加某用户下文章列表
  [types.ADD_USER_POST_TO_BRIEF_MAP](state: State, payload: { userId: string, postBriefMap: PostBriefMap }) {
    // 初始化对象
    if (!state.userToPostMap[payload.userId]) {
      state.userToPostMap[payload.userId] = <UserToPost>{}
    }

    state.userToPostMap[payload.userId].postBriefMap = {
      ...payload.postBriefMap
    }
  },

  // 修改某分类下文章列表某项是否点赞
  [types.TOGGLE_BRIEF_POST_LIKE](state: State, payload: { categoryId: string, targetId: string }) {
    const {
      categoryId,
      targetId
    } = payload;

    let ifLikeBefore = state.categoryToPostMap[categoryId].postBriefMap[targetId].ifLike;
    let beforeLikeCount = state.categoryToPostMap[categoryId].postBriefMap[targetId].likeCount;

    state.categoryToPostMap[categoryId] = {
      ...state.categoryToPostMap[categoryId],
      postBriefMap: {
        ...state.categoryToPostMap[categoryId].postBriefMap,
        [targetId]: {
          ...state.categoryToPostMap[categoryId].postBriefMap[targetId],
          likeCount: ifLikeBefore ? --beforeLikeCount : ++beforeLikeCount,
          ifLike: !(ifLikeBefore)
        }
      }
    }
  },

  // 添加单条文章详细信息
  [types.ADD_POST_TO_DETAIL_MAP](state: State, post: PostDetail) {
    // 初始化对象
    if (!state.postDetailMap[post._id]) {
      state.postDetailMap[post._id] = <PostDetail>{}
    }

    state.postDetailMap = {
      ...state.postDetailMap,
      [post._id]: post
    }
  },

  // 添加某分类下文章列表 ids
  [types.SET_POST_IDS](state: State, payload: { categoryId: string, postIds: string[] }) {
    // 初始化对象
    if (!state.categoryToPostMap[payload.categoryId]) {
      state.categoryToPostMap[payload.categoryId] = <CategoryToPost>{}
    }

    state.categoryToPostMap[payload.categoryId].postIds = [
      ...payload.postIds
    ]
  },

  // 添加某用户下文章列表 ids
  [types.SET_USER_POST_IDS](state: State, payload: { userId: string, postIds: string[] }) {
    // 初始化对象
    if (!state.userToPostMap[payload.userId]) {
      state.userToPostMap[payload.userId] = <UserToPost>{}
    }

    state.userToPostMap[payload.userId].postIds = [
      ...payload.postIds
    ]
  },

  // 添加评论 id 到 postdetailMap
  [types.ADD_COMMENT_ID_TO_POST_DETAIL](state: State, commentDetail: CommentDetail) {
    state.postDetailMap[commentDetail.postId].comment = [
      commentDetail._id,
      ...state.postDetailMap[commentDetail.postId].comment
    ]
  },

  // 评论数 + 1
  [types.ADD_COMMENT_COUNT_IN_POST_DETAIL](state: State, postId: string) {
    state.postDetailMap = {
      ...state.postDetailMap,
      [postId]: {
        ...state.postDetailMap[postId],
        commentCount: state.postDetailMap[postId].commentCount + 1
      }
    }
  },

  // // 添加回复到 postdetailMap
  // [types.ADD_REPLY_TO_POST_DETAIL](state: State, replyDetail: ReplyDetail) {
  //   state.postDetailMap[replyDetail.postId].comment = [
  //     replyDetail,
  //     ...state.postDetailMap[replyDetail.postId].comment
  //   ]
  // },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}