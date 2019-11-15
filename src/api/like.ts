import {
  get,
  post,
  put,
} from "./http"

export type LikeTargetType = 'post' | 'comment' | 'reply'

export interface LikePayload {
  targetId: string,
  type: LikeTargetType,
  authorId: string,
}

export const toggleLike = ({ targetId, type, authorId}: LikePayload): Promise<any> => {
  return post(`/like/${targetId}?type=${type}`, {
    authorId
  })
}
