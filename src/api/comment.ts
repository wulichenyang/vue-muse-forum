import {
  get,
  post,
  put,
} from "./http"

export type CommentState = 'published' | 'draft'

export interface CommentPayload {
  postId: string,
  content: string,
  state: CommentState,
}

export const addComment = ({ postId, content, state }: CommentPayload): Promise<any> => {
  return post(`/posts/${postId}/comments`, { content, state })
}

export const fetchCommentsOfOtherUser = (userId: string, loginUserId?: string): Promise<any> => {
  if(loginUserId) {
    return get(`/users/${userId}/comments?userId=${loginUserId}`)
  } else {
    return get(`/users/${userId}/comments`)
  }
}