import { Commit, Dispatch } from "vuex"
import * as types from "../mutation-types"
import { fetchCategoryList } from '@/api/category';
import To from '@/utils/to'
import {
  CategoryDetail
} from '@/assets/js/dataType'

export interface CategoryMap {
  [key: string]: CategoryDetail
}

export interface State {
  categoryMap: CategoryMap | {};
  categoryIds: string[];
}

const initState: State = {
  categoryMap: {},
  categoryIds: [],
}

// getters
const getters = {
  categoryMap: (state: State) => state.categoryMap,
  categoryIds: (state: State) => state.categoryIds,
  categoryDetail: (state: State) => (id: string) => {
    return (state.categoryMap as CategoryMap)[id]
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
}

// mutations
const mutations = {
  [types.SET_CATEGORY_MAP](state: State, payload: CategoryMap) {
    console.log(state)
    state.categoryMap = {
      ...payload
    }
  },
  [types.SET_CATEGORY_IDS](state: State, payload: string[]) {
    console.log(state)
    state.categoryIds = [
      ...payload
    ]
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}