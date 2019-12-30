import { Commit, Dispatch } from "vuex"
import * as types from "../mutation-types"
import {
  fetchPostListByCategory,
  fetchPostDetail,
  fetchPostsOfOtherUser,
} from '@/api/post';
import {
  fetchFollowPostsOfOtherUser,
} from "@/api/follow"

import {
  toggleLike,
  LikeTargetType,
  LikePayload,
} from "@/api/like"
import {
  FollowPayload,
  FollowTargetType,
  toggleFollow
} from '@/api/follow'
import To from '@/utils/to'
import {
  PostBrief,
  PostRawDetail,
  PostDetail,
  CommentRawDetail,
  CommentDetail,
  ReplyDetail,
  PageRequestPayload,
  CategorytoPageRequestPayloadMap,
} from '@/assets/js/dataType'
import Vue from 'vue'

export interface CategoryToPostIdsMap {
  [categoryId: string]: string[]
}

export interface UserToPostIdsMap {
  [userId: string]: string[]
}

export interface PostBriefMap {
  [postId: string]: PostBrief
}

export interface PostDetailMap {
  [postId: string]: PostDetail
}

export interface State {
  // 各个文章分类下对应的文章ids
  categoryToPostMapIds: CategoryToPostIdsMap,

  // 各个文章分类下对应的请求页数
  categorytoPageRequestPayloadMap: CategorytoPageRequestPayloadMap,

  // 某个用户所有发布的文章ids
  userToPostMapIds: UserToPostIdsMap,
  // 某个用户所有关注的文章ids
  userToFollowPostMapIds: UserToPostIdsMap,

  // 文章列表项简略内容表
  postBriefMap: PostBriefMap,
  // 文章详细内容
  postDetailMap: PostDetailMap,
}

const initState: State = {
  // 各个文章分类下对应的文章ids
  categoryToPostMapIds: <CategoryToPostIdsMap>{},

  // 各个文章分类下对应的请求页数
  categorytoPageRequestPayloadMap: <CategorytoPageRequestPayloadMap>{},

  // 某个用户所有发布的文章ids
  userToPostMapIds: <UserToPostIdsMap>{},
  // 某个用户所有关注的文章ids
  userToFollowPostMapIds: <UserToPostIdsMap>{},

  // 文章列表项简略内容表
  postBriefMap: <PostBriefMap>{},
  // 文章详细内容
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

  // 文章简略列表map
  postBriefMap: (state: State) => (categoryId: string) => {
    return state.postBriefMap
  },

  // 各个文章分类下对应的请求页数
  categorytoPageRequestPayloadMap: (state: State) => (categoryId: string) => {
    // 动态属性需要手动初始化，防止第一次渲染不更新数据
    // 初始化 categorytoPageRequestPayloadMap 里对应id的映射分页对象
    if (!state.categorytoPageRequestPayloadMap[categoryId]) {
      Vue.set(state.categorytoPageRequestPayloadMap, categoryId, {
        page: 0,
        noMore: false
      });
    }

    return state.categorytoPageRequestPayloadMap[categoryId];
  },

  // 某分类下的文章ids
  categoryPostIds: (state: State) => (categoryId: string) => {
    // 动态属性需要手动初始化，防止第一次渲染不更新数据
    // 初始化categoryToPostMap里对应id的映射数组对象
    if (!state.categoryToPostMapIds[categoryId]) {
      Vue.set(state.categoryToPostMapIds, categoryId, []);
    }
    return (state.categoryToPostMapIds[categoryId])
  },

  // 某用户发表的文章ids
  userPostIds: (state: State) => (userId: string) => {
    // 动态属性需要手动初始化，防止第一次渲染不更新数据
    // 初始化 userToPostMapIds 里对应id的映射对象
    if (!state.userToPostMapIds[userId]) {
      Vue.set(state.userToPostMapIds, userId, []);
    }
    return (state.userToPostMapIds[userId])
  },


  // 某用户关注的文章ids
  userFollowPostIds: (state: State) => (userId: string) => {
    // 动态属性需要手动初始化，防止第一次渲染不更新数据
    // 初始化 userToFollowPostMapIds 里对应id的映射对象
    if (!state.userToFollowPostMapIds[userId]) {
      Vue.set(state.userToFollowPostMapIds, userId, []);
    }
    return (state.userToFollowPostMapIds[userId])
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
  async getPostList(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { categoryId: string, userId?: string, pageRequestPayload: PageRequestPayload }) {
    const { categoryId, userId, pageRequestPayload } = payload;
    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchPostListByCategory(categoryId, pageRequestPayload, userId));

    // 获取失败
    if (err) {
      return false
    }

    if (res && res.code === 0) {
      // 获取成功
      if (res.data.noMore) {
        context.commit(types.NO_MORE_DATA_CATEGORY_TO_LIST_PAGE, { categoryId })
        return 'noMore'
      } else {
        let postBriefMap: PostBriefMap = {};
        let postIds: string[] = (res.data.postBriefList as Array<PostBrief>).map((x: PostBrief) => {
          postBriefMap[x._id] = x;
          return x._id
        });

        context.commit(types.SET_POST_IDS, { categoryId, postIds })
        context.commit(types.ADD_POST_TO_BRIEF_MAP, { postBriefMap })
        return true
      }
    }
  },

  // 翻页 更新对应category下的分页信息
  async addCategoryToListPage(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { categoryId: string }) {
    const { categoryId } = payload;

    context.commit(types.ADD_CATEGORY_TO_LIST_PAGE, { categoryId })
  },

  // 最后一页 更新对应category下的分页信息
  async noMoreDataCategoryToListPage(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { categoryId: string }) {
    const { categoryId } = payload;

    context.commit(types.NO_MORE_DATA_CATEGORY_TO_LIST_PAGE, { categoryId })
  },

  // 重置翻页信息 更新对应category下的分页信息
  async resetCategoryToListPage(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { categoryId: string }) {
    const { categoryId } = payload;

    context.commit(types.RESET_CATEGORY_TO_LIST_PAGE, { categoryId })
  },

  // 刷新某分类下的文章列表信息
  async refreshPostList(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { categoryId: string, userId?: string, pageRequestPayload: PageRequestPayload }) {
    const {
      categoryId
    } = payload;
    context.commit(types.RESET_POST_LIST_IDS, { categoryId })
    context.dispatch('getPostList', payload)
  },

  // 获取某用户发表的文章列表信息
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
      context.commit(types.ADD_POST_TO_BRIEF_MAP, { postBriefMap })
      return true
    }
  },

  // 获取某用户关注的文章列表信息
  async getUserFollowPostList(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { userId: string, loginUserId?: string }) {
    const { userId, loginUserId } = payload;
    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchFollowPostsOfOtherUser(userId, loginUserId));

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

      context.commit(types.SET_USER_FOLLOW_POST_IDS, { userId, postIds })
      context.commit(types.ADD_POST_TO_BRIEF_MAP, { postBriefMap })
      return true
    }
  },

  // 获取文章详细信息
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

  // 对文章简略列表的某文章进行点赞/取消
  async toggleBriefPostLike(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { targetId: string, type: LikeTargetType, authorId: string }) {
    // 点赞
    const {
      targetId,
      type,
      authorId
    } = payload

    // 对某文章的点赞/取消
    context.commit(types.TOGGLE_BRIEF_POST_LIKE, { targetId })
    context.commit(types.TOGGLE_DETAIL_POST_LIKE, { targetId })

    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(toggleLike({ targetId, type, authorId }));

    // 更新失败
    if (err) {
      // 取消/恢复 点赞行为
      context.commit(types.TOGGLE_BRIEF_POST_LIKE, { targetId })
      context.commit(types.TOGGLE_DETAIL_POST_LIKE, { targetId })
      return false
    }

    if (res && res.code === 0) {
      return true
    }
  },

  // 对某文章详细内容的 点赞/取消 进行更新
  async toggleDetailPostLike(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { targetId: string, type: LikeTargetType, authorId: string }) {
    // 点赞
    const {
      targetId,
      type,
      authorId
    } = payload

    // 对某文章的点赞/取消
    context.commit(types.TOGGLE_DETAIL_POST_LIKE, { targetId })
    context.commit(types.TOGGLE_BRIEF_POST_LIKE, { targetId })

    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(toggleLike({ targetId, type, authorId }));

    // 更新失败
    if (err) {
      // 取消/恢复 点赞行为
      context.commit(types.TOGGLE_DETAIL_POST_LIKE, { targetId })
      context.commit(types.TOGGLE_BRIEF_POST_LIKE, { targetId })
      return false
    }

    if (res && res.code === 0) {
      return true
    }
  },

  // 用户对某分类进行关注和取消
  async togglePostDetailFollow(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { targetId: string, type: FollowTargetType, userId: string }) {
    // 点赞
    const {
      targetId,
      type,
      userId,
    } = payload

    // 对某文章详细信息的关注
    context.commit(types.TOGGLE_POST_FOLLOW, { targetId })
    // 修改某用户关注的文章列表某项是否关注
    context.commit(types.TOGGLE_USER_FOLLOW_POST_FOLLOW, { userId, targetId })

    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(toggleFollow({ targetId, type }));

    // 更新失败
    if (err) {

      // 取消对某文章详细信息的关注
      context.commit(types.TOGGLE_POST_FOLLOW, { targetId })
      // 取消某用户关注的文章列表某项是否关注
      context.commit(types.TOGGLE_USER_FOLLOW_POST_FOLLOW, { userId, targetId })
      return false
    }

    if (res && res.code === 0) {
      return true
    }
  },
}

// mutations
const mutations = {
  // 添加文章列表
  [types.ADD_POST_TO_BRIEF_MAP](state: State, payload: { postBriefMap: PostBriefMap }) {
    // 初始化对象
    if (!state.postBriefMap) {
      state.postBriefMap = {}
    }

    state.postBriefMap = {
      ...state.postBriefMap,
      ...payload.postBriefMap
    }
  },

  // 添加某用户发表的文章列表 ids
  [types.SET_USER_POST_IDS](state: State, payload: { userId: string, postIds: string[] }) {
    // 初始化数组对象
    if (!state.userToPostMapIds[payload.userId]) {
      state.userToPostMapIds[payload.userId] = []
    }

    state.userToPostMapIds[payload.userId] = [
      ...payload.postIds
    ]
  },

  // 添加某用户关注的文章列表 ids
  [types.SET_USER_FOLLOW_POST_IDS](state: State, payload: { userId: string, postIds: string[] }) {
    // 初始化数组对象
    if (!state.userToFollowPostMapIds[payload.userId]) {
      state.userToFollowPostMapIds[payload.userId] = []
    }

    state.userToFollowPostMapIds[payload.userId] = [
      ...payload.postIds
    ]
  },

  // 翻页 更新对应category下的分页信息
  [types.ADD_CATEGORY_TO_LIST_PAGE](state: State, payload: { categoryId: string }) {
    const {
      categoryId
    } = payload;

    // 有缓存则修改
    if (state.categorytoPageRequestPayloadMap[categoryId]
    ) {

      let newPage = state.categorytoPageRequestPayloadMap[categoryId].page + 1;

      state.categorytoPageRequestPayloadMap[categoryId] = {
        ...state.categorytoPageRequestPayloadMap[categoryId],
        page: newPage,
        // noMore: false
      }
    }
  },

  // 最后一页 更新对应category下的分页信息
  [types.NO_MORE_DATA_CATEGORY_TO_LIST_PAGE](state: State, payload: { categoryId: string }) {
    const {
      categoryId
    } = payload;

    state.categorytoPageRequestPayloadMap[categoryId] = {
      ...state.categorytoPageRequestPayloadMap[categoryId],
      noMore: true
    }
  },

  // 重置翻页数据 更新对应category下的分页信息
  [types.RESET_CATEGORY_TO_LIST_PAGE](state: State, payload: { categoryId: string }) {
    const {
      categoryId
    } = payload;

    state.categorytoPageRequestPayloadMap[categoryId] = {
      page: 0,
      noMore: false
    }
  },

  // 修改某分类下文章列表某文章是否点赞
  [types.TOGGLE_BRIEF_POST_LIKE](state: State, payload: { targetId: string }) {
    const {
      targetId
    } = payload;

    // 有缓存则修改
    if (state.postBriefMap[targetId]
    ) {
      let ifLikeBefore = state.postBriefMap[targetId].ifLike;
      let beforeLikeCount = state.postBriefMap[targetId].likeCount;

      state.postBriefMap[targetId] = {
        ...state.postBriefMap[targetId],
        likeCount: ifLikeBefore ? --beforeLikeCount : ++beforeLikeCount,
        ifLike: !(ifLikeBefore)
      }
    }
  },

  // 修改某文章详细内容是否点赞
  [types.TOGGLE_DETAIL_POST_LIKE](state: State, payload: { targetId: string }) {
    const {
      targetId
    } = payload;

    // 有缓存则修改
    if (state.postDetailMap[targetId]
    ) {
      let ifLikeBefore = state.postDetailMap[targetId].ifLike;
      let beforeLikeCount = state.postDetailMap[targetId].likeCount;

      state.postDetailMap[targetId] = {
        ...state.postDetailMap[targetId],
        likeCount: ifLikeBefore ? --beforeLikeCount : ++beforeLikeCount,
        ifLike: !(ifLikeBefore)
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
    // 初始化数组对象
    if (!state.categoryToPostMapIds[payload.categoryId]) {
      state.categoryToPostMapIds[payload.categoryId] = []
    }

    state.categoryToPostMapIds[payload.categoryId] = [
      ...state.categoryToPostMapIds[payload.categoryId],
      ...payload.postIds
    ]
  },

  // 添加某分类下文章列表 ids
  [types.RESET_POST_LIST_IDS](state: State, payload: { categoryId: string }) {
    // 初始化数组对象
    state.categoryToPostMapIds[payload.categoryId] = []
  },

  // 添加评论 id 到 postdetailMap
  [types.ADD_COMMENT_ID_TO_POST_DETAIL](state: State, commentDetail: CommentDetail) {
    state.postDetailMap[commentDetail.postId as string].comment = [
      commentDetail._id,
      ...state.postDetailMap[commentDetail.postId as string].comment
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

  // 修改对某文章详细信息是否关注
  [types.TOGGLE_POST_FOLLOW](state: State, payload: { targetId: string }) {
    const {
      targetId,
    } = payload;

    // 有缓存则修改
    if (state.postDetailMap[targetId] && state.postDetailMap[targetId]._id) {
      let ifFollowBefore = state.postDetailMap[targetId].ifFollow;
      let followCount = state.postDetailMap[targetId].followCount;

      state.postDetailMap = {
        ...state.postDetailMap,
        [targetId]: {
          ...state.postDetailMap[targetId],
          followCount: ifFollowBefore ? --followCount : ++followCount,
          ifFollow: !(ifFollowBefore),
        }
      }

    }
  },

  // 修改某用户关注的文章列表某项是否关注
  [types.TOGGLE_USER_FOLLOW_POST_FOLLOW](state: State, payload: { userId: string, targetId: string }) {
    const {
      userId,
      targetId
    } = payload;

    // 没有缓存则不用处理
    if (state.userToFollowPostMapIds[userId] === undefined) {
      // state.userToFollowPostMapIds[userId] = []
      return;
    } else {
      let index = state.userToFollowPostMapIds[userId].indexOf(targetId);
      if (index !== -1) {
        // 删除postId
        state.userToFollowPostMapIds[userId].splice(index, 1)
      } else {
        // 添加postId
        state.userToFollowPostMapIds[userId] = [
          targetId,
          ...state.userToFollowPostMapIds[userId]
        ]
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