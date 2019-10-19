import {
  get,
  post,
  put,
} from "./http"

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

export const fetchPostListByCategory = (categoryId: string, userId?: string): Promise<any> => {
  if (userId) {
    return get(`/categories/${categoryId}/posts?userId=${userId}`)
  } else {
    return get(`/categories/${categoryId}/posts`)
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

export const updatePost = ({ title, content, state, postId }: UpdatePostPayload): Promise<any> => {
  return put(`/posts/${postId}`, { title, content, state })
}