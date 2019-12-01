import { Commit, Dispatch } from "vuex"
import * as types from "../mutation-types"
import { fetchCategoryList } from '@/api/category';
import To from '@/utils/to'
import {
  CategoryDetail,
  CategoryHeaderDetail
} from '@/assets/js/dataType'
import {
  FollowPayload,
  FollowTargetType,
  toggleFollow
} from '@/api/follow'
import {
  fetchCategoryHeaderDetail
} from '@/api/category'
import {
  fetchFollowCategoryList
} from '@/api/follow'
import Vue from 'vue'

export interface CategoryMap {
  [categoryId: string]: CategoryDetail
}

export interface CategoryHeaderDetailMap {
  [categoryId: string]: CategoryHeaderDetail
}


export interface UserFollowCategoryIdsMap {
  [userId: string]: string[]
}

export interface State {
  // 主页分类简略信息map
  categoryMap: CategoryMap;
  // 主页分类ids
  categoryIds: string[];
  // 主页分类详细信息map
  categoryHeaderDetailMap: CategoryHeaderDetailMap;
  // 用户关注的分类ids
  userFollowCategoryIdsMap: UserFollowCategoryIdsMap
}

const initState: State = {
  // 主页分类简略信息map
  categoryMap: <CategoryMap>{},
  // 主页分类ids
  categoryIds: [],
  // 主页分类详细信息map
  categoryHeaderDetailMap: <CategoryHeaderDetailMap>{},
  // 用户关注的分类ids
  userFollowCategoryIdsMap: <UserFollowCategoryIdsMap>{},

}

// getters
const getters = {
  // 主页分类简略信息map
  categoryMap: (state: State) => state.categoryMap,
  // 主页分类ids
  categoryIds: (state: State) => state.categoryIds,
  // 主页分类详细信息
  categoryDetail: (state: State) => (id: string) => {
    return (state.categoryMap as CategoryMap)[id]
  },
  // 分类id索引主页分类详细信息
  categoryHeaderDetail: (state: State) => (categoryId: string) => {
    if (!(state.categoryHeaderDetailMap as CategoryHeaderDetailMap)[categoryId]) {
      (state.categoryHeaderDetailMap as CategoryHeaderDetailMap)[categoryId] = <CategoryHeaderDetail>{}
    }
    return state.categoryHeaderDetailMap[categoryId]
  },

  // 某用户下的关注分类ids
  userFollowCategoryIds: (state: State) => (userId: string) => {
    // 动态属性需要手动初始化，防止第一次渲染不更新数据
    if (!state.userFollowCategoryIdsMap[userId]) {
      Vue.set(state.userFollowCategoryIdsMap, userId, []);
    }
    return (state.userFollowCategoryIdsMap[userId])
  },
}

// actions
const actions = {
  // 获取主页分类简略信息列表
  async getCategoryList(context: { dispatch: Dispatch, commit: Commit; state: State }) {
    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchCategoryList());
    // 获取失败
    if (err) {
      return false
    }
    if (res && res.code === 0) {
      // 获取成功
      let categoryMap: CategoryMap = {};
      let categoryIds: string[] = (res.data as Array<CategoryDetail>).map((x: CategoryDetail) => {
        categoryMap[x._id] = x;
        return x._id
      });

      context.commit(types.SET_CATEGORY_MAP, categoryMap as CategoryMap)
      context.commit(types.SET_CATEGORY_IDS, categoryIds as string[])
      return true
    }
  },

  // 增加分类发文数量
  addCategoryPostCount(context: { dispatch: Dispatch, commit: Commit; state: State }, categoryId: string) {
    context.commit(types.ADD_CATEGORY_POST_COUNT, categoryId)
  },

  // 获取主页分类详细信息
  async getCategoryHeaderDetail(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: {
    categoryId: string, userId: string
  }) {
    console.log(payload)
    const {
      categoryId,
      userId,
    } = payload;

    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchCategoryHeaderDetail(categoryId, userId));

    // 获取失败
    if (err) {
      return false
    }
    if (res && res.code === 0) {
      // 获取成功
      console.log(res.data)
      context.commit(types.ADD_CATEGORY_HEADER_DETAIL, res.data as CategoryHeaderDetail)
      return true
    }
  },

  // 用户对某分类进行关注和取消
  async toggleCategoryFollow(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { targetId: string, type: FollowTargetType }) {
    // 点赞
    const {
      targetId,
      type,
    } = payload

    // 对某分类的关注
    context.commit(types.TOGGLE_CATEGORY_FOLLOW, { targetId })

    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(toggleFollow({ targetId, type }));

    // 更新失败
    if (err) {
      // 取消对某分类的关注
      context.commit(types.TOGGLE_CATEGORY_FOLLOW, { targetId })

      return false
    }

    if (res && res.code === 0) {
      return true
    }
  },
  
  // 获取某用户的关注用户列表信息
  async getFollowCategoryList(context: { dispatch: Dispatch, commit: Commit; state: State }, payload: { userId: string, loginUserId?: string }) {
    const { userId, loginUserId } = payload;
    let err, res: Ajax.AjaxResponse;
    [err, res] = await To(fetchFollowCategoryList(userId, loginUserId));

    // 获取失败
    if (err) {
      return false
    }

    if (res && res.code === 0) {
      // 获取成功
      let categoryHeaderDetailMap: CategoryHeaderDetailMap = {};
      let categoryIds: string[] = (res.data as Array<CategoryHeaderDetail>).map((x: CategoryHeaderDetail) => {
        categoryHeaderDetailMap[x._id] = x;
        return x._id
      });

      context.commit(types.SET_FOLLOW_CATEGORY_LIST_IDS, { userId, categoryIds })
      context.commit(types.ADD_USER_CATEGORY_LIST_TO_CATEGORY_HEADER_DETAIL_MAP, { categoryHeaderDetailMap })
      return true
    }
  },


}

// mutations
const mutations = {
  // 设置分类详细信息map
  [types.SET_CATEGORY_MAP](state: State, categoryMap: CategoryMap) {
    state.categoryMap = {
      ...categoryMap
    }
  },
  // 设置分类ids
  [types.SET_CATEGORY_IDS](state: State, ids: string[]) {
    state.categoryIds = [
      ...ids
    ]
  },
  // 添加分类中发文数量
  [types.ADD_CATEGORY_POST_COUNT](state: State, categoryId: string) {
    console.log((state.categoryMap as CategoryMap)[categoryId]);
    (state.categoryMap as CategoryMap)[categoryId] = {
      ...(state.categoryMap as CategoryMap)[categoryId],
      postCount: (state.categoryMap as CategoryMap)[categoryId].postCount + 1
    }
  },
  // 添加分类详细内容
  [types.ADD_CATEGORY_HEADER_DETAIL](state: State, categoryHeaderDetail: CategoryHeaderDetail) {
    const categoryId = categoryHeaderDetail._id;

    state.categoryHeaderDetailMap = {
      ...state.categoryHeaderDetailMap,
      [categoryId]: categoryHeaderDetail
    }
  },

  // 修改对某分类是否关注
  [types.TOGGLE_CATEGORY_FOLLOW](state: State, payload: { targetId: string }) {
    const {
      targetId,
    } = payload;

    // 有缓存则修改
    if (state.categoryHeaderDetailMap[targetId] && state.categoryHeaderDetailMap[targetId]._id) {
      let ifFollowBefore = state.categoryHeaderDetailMap[targetId].ifFollow;
      let followCount = state.categoryHeaderDetailMap[targetId].followCount;

      state.categoryHeaderDetailMap = {
        ...state.categoryHeaderDetailMap,
        [targetId]: {
          ...state.categoryHeaderDetailMap[targetId],
          followCount: ifFollowBefore ? --followCount : ++followCount,
          ifFollow: !(ifFollowBefore),
        }
      }

    }
  },
  
  // 添加某用户下关注的分类列表 ids
  [types.SET_FOLLOW_CATEGORY_LIST_IDS](state: State, payload: { userId: string, categoryIds: string[] }) {
    state.userFollowCategoryIdsMap[payload.userId] = payload.categoryIds
  },

  // 添加主页分类详细信息
  [types.ADD_USER_CATEGORY_LIST_TO_CATEGORY_HEADER_DETAIL_MAP](state: State, payload: { categoryHeaderDetailMap: CategoryHeaderDetailMap }) {
    state.categoryHeaderDetailMap = {
      ...state.categoryHeaderDetailMap,
      ...payload.categoryHeaderDetailMap
    }
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}