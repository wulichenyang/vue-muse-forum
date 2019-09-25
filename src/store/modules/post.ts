import { Commit, Dispatch } from "vuex"
import * as types from "../mutation-types"
// import { fetchPostList } from '@/api/post';
import To from '@/utils/to'
import {
  PostDetail
} from '@/assets/js/dataType'

export interface PostMap {
  [key: string]: PostDetail
}

export interface State {
  postMap: PostMap | {};
  postIds: string[];
}

const initState: State = {
  postMap: {},
  postIds: [],
}

// getters
const getters = {
  postMap: (state: State) => state.postMap,
  postIds: (state: State) => state.postIds,
  postDetail: (state: State) => (id: string) => {
    return (state.postMap as PostMap)[id]
  }
}

// actions
const actions = {
  setPost(context: { dispatch: Dispatch, commit: Commit; state: State }) {
    return (post: PostDetail) => {
      context.commit(types.ADD_POST_TO_MAP, post)
      context.commit(types.ADD_POST_TO_IDS, post._id)
    }
  },
}

// mutations
const mutations = {
  [types.ADD_POST_TO_MAP](state: State, post: PostDetail) {
    console.log(state);
    (state.postMap as PostMap)[post._id] = {
      ...post
    }
  },
  [types.ADD_POST_TO_IDS](state: State, postId: string) {
    console.log(state)
    state.postIds = [
      ...state.postIds,
      postId
    ]
  },
  [types.SET_POST_MAP](state: State, postMap: PostMap) {
    console.log(state)
    state.postMap = {
      ...postMap
    }
  },
  [types.SET_POST_IDS](state: State, ids: string[]) {
    console.log(state)
    state.postIds = [
      ...ids
    ]
  },
}

export default {
  state: initState,
  getters,
  actions,
  mutations,
}