import { Commit, Dispatch } from "vuex"
import * as types from "../mutation-types"
import {
  fetchPostListByCategory,
  fetchPostDetail
} from '@/api/post';
import To from '@/utils/to'
import {
  PostBrief,
  PostDetail
} from '@/assets/js/dataType'
import Vue from 'vue'

export interface CategoryToPost {
  postBriefMap: PostBriefMap,
  // postDetailMap: PostDetailMap,
  postIds: string[],
  // postDetailIds: string[],
}

export interface CategoryToPostMap {
  [key: string]: CategoryToPost
}

export interface PostBriefMap {
  [key: string]: PostBrief
}

export interface PostDetailMap {
  [key: string]: PostDetail
}

export interface State {
  categoryToPostMap: CategoryToPostMap,
  postDetailMap: PostDetailMap
}

const initState: State = {
  categoryToPostMap: <CategoryToPostMap>{},
  postDetailMap: <PostDetailMap>{}
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

  // 文章详细信息map
  postDetailMap: (state: State) => {
    return state.postDetailMap
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
  async getPostList(context: { dispatch: Dispatch, commit: Commit; state: State }, categoryId: string) {
    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchPostListByCategory(categoryId));

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

  async getPostDetail(context: { dispatch: Dispatch, commit: Commit; state: State }, postId: string) {
    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchPostDetail(postId));

    // 获取失败
    if (err) {
      return false
    }

    if (res && res.code === 0) {
      // 获取成功
      context.commit(types.ADD_POST_TO_DETAIL_MAP, res.data as PostDetail)
      return true
    }
  },

}

// mutations
const mutations = {
  // 添加文章列表
  [types.ADD_POST_TO_BRIEF_MAP](state: State, payload: { categoryId: string, postBriefMap: PostBriefMap }) {
    console.log(state);
    // 初始化对象
    if (!state.categoryToPostMap[payload.categoryId]) {
      state.categoryToPostMap[payload.categoryId] = <CategoryToPost>{}
    }

    state.categoryToPostMap[payload.categoryId].postBriefMap = {
      ...payload.postBriefMap
    }
  },
  // 添加单条文章详细信息
  [types.ADD_POST_TO_DETAIL_MAP](state: State, post: PostDetail) {
    console.log(state);

    // 初始化对象
    if (!state.postDetailMap[post._id]) {
      state.postDetailMap[post._id] = <PostDetail>{}
    }

    state.postDetailMap = {
      ...state.postDetailMap,
      [post._id]: post
    }
  },

  // 添加文章列表ids
  [types.SET_POST_IDS](state: State, payload: { categoryId: string, postIds: string[] }) {
    console.log(state)
    // 初始化对象
    if (!state.categoryToPostMap[payload.categoryId]) {
      state.categoryToPostMap[payload.categoryId] = <CategoryToPost>{}
    }

    state.categoryToPostMap[payload.categoryId].postIds = [
      ...payload.postIds
    ]
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}