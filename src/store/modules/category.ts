import { Commit, Dispatch } from "vuex"
import * as types from "../mutation-types"
import { fetchCategoryList } from '@/api/category';
import To from '@/utils/to'
import {
  CategoryDetail,
  CategoryHeaderDetail
} from '@/assets/js/dataType'

import {
  fetchCategoryHeaderDetail
} from '@/api/category'

export interface CategoryMap {
  [categoryId: string]: CategoryDetail
}

export interface CategoryHeaderDetailMap {
  [categoryId: string]: CategoryHeaderDetail
}

export interface State {
  // For categoryList
  categoryMap: CategoryMap;
  categoryIds: string[];
  // For categoryDetail
  categoryHeaderDetailMap: CategoryHeaderDetailMap;
}

const initState: State = {
  categoryMap: <CategoryMap>{},
  categoryIds: [],
  categoryHeaderDetailMap: <CategoryHeaderDetailMap>{}
}

// getters
const getters = {
  categoryMap: (state: State) => state.categoryMap,
  categoryIds: (state: State) => state.categoryIds,
  categoryDetail: (state: State) => (id: string) => {
    return (state.categoryMap as CategoryMap)[id]
  },
  categoryHeaderDetail: (state: State) =>(categoryId: string) => {
    if(!(state.categoryHeaderDetailMap as CategoryHeaderDetailMap )[categoryId]) {
      (state.categoryHeaderDetailMap as CategoryHeaderDetailMap)[categoryId] = <CategoryHeaderDetail>{}
    }
    return state.categoryHeaderDetailMap[categoryId]
  }
}

// actions
const actions = {
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

  addCategoryPostCount(context: { dispatch: Dispatch, commit: Commit; state: State }, categoryId: string) {
    context.commit(types.ADD_CATEGORY_POST_COUNT, categoryId)
  },

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
}

// mutations
const mutations = {
  [types.SET_CATEGORY_MAP](state: State, categoryMap: CategoryMap) {
    state.categoryMap = {
      ...categoryMap
    }
  },
  [types.SET_CATEGORY_IDS](state: State, ids: string[]) {
    state.categoryIds = [
      ...ids
    ]
  },
  [types.ADD_CATEGORY_POST_COUNT](state: State, categoryId: string) {
    console.log((state.categoryMap as CategoryMap)[categoryId]);
    (state.categoryMap as CategoryMap)[categoryId] = {
      ...(state.categoryMap as CategoryMap)[categoryId],
      postCount: (state.categoryMap as CategoryMap)[categoryId].postCount + 1
    }
  },
  [types.ADD_CATEGORY_HEADER_DETAIL](state: State, categoryHeaderDetail: CategoryHeaderDetail) {
    const categoryId = categoryHeaderDetail._id;

    state.categoryHeaderDetailMap = {
      ...state.categoryHeaderDetailMap,
      [categoryId]: categoryHeaderDetail
    }
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}