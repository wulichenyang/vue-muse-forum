import {
  get,
  post,
  put,
} from "./http"

import { PageRequestPayload } from '@/assets/js/dataType'

export type PostState = 'published' | 'draft'

export interface PostPayload {
  categoryId: string,
  title: string,
  content: string,
  state: PostState,
}

export interface UpdatePostPayload {
  postId: string,
  title: string,
  content: string,
  state: PostState,
}

export const addPost = ({ categoryId, title, content, state }: PostPayload): Promise<any> => {
  return post(`/categories/${categoryId}/posts`, { title, content, state })
}

export const fetchPostListByCategory = (categoryId: string, pageRequestPayload: PageRequestPayload, userId?: string): Promise<any> => {
  if (userId) {
    return get(`/categories/${categoryId}/posts?userId=${userId}&page=${pageRequestPayload.page}`)
  } else {
    return get(`/categories/${categoryId}/posts?page=${pageRequestPayload.page}`)
  }
}

export const fetchPostDetail = (postId: string, userId?: string): Promise<any> => {
  if (userId) {
    return get(`/posts/${postId}?userId=${userId}`)
  } else {
    return get(`/posts/${postId}`)
  }
}

export const fetchAllPostList = (): Promise<any> => {
  return get('/posts')
}

export const fetchPostsOfOtherUser = (userId: string, loginUserId?: string): Promise<any> => {
  if (loginUserId) {
    return get(`/users/${userId}/posts?userId=${loginUserId}`)
  } else {
    return get(`/users/${userId}/posts`)
  }
}

export const updatePost = ({ title, content, state, postId }: UpdatePostPayload): Promise<any> => {
  return put(`/posts/${postId}`, { title, content, state })
}