import {
  get,
  post,
  put,
} from "./http"

export type FollowTargetType = 'post' | 'category' | 'user'

export interface FollowPayload {
  targetId: string,
  type: FollowTargetType,
}

export const toggleFollow = ({ targetId, type}: FollowPayload): Promise<any> => {
  return post(`/follow/${targetId}?type=${type}`, {})
}
