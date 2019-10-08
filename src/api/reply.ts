import {
  get,
  post,
  put,
} from "./http"

export type ReplyState = 'published' | 'draft'

export interface ReplyPayload {
  // 回复对象用户id
  to: string,
  commentId: string,
  content: string,
  state: ReplyState,
}

export const addReply = ({ to, commentId, content, state }: ReplyPayload): Promise<any> => {
  return post(`/comments/${commentId}/replies`, { to, content, state })
}
