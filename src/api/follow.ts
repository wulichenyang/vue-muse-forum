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

// 获取某用户的粉丝列表
// /users/${id}/fans?userId=${loginUserId}
export const fetchFansOfOtherUser = (targetUserId: string, loginUserId?: string): Promise<any> => {
  if(loginUserId) {
    return get(`/users/${targetUserId}/fans?userId=${loginUserId}`)
  } else {
    return get(`/users/${targetUserId}/fans`)
  }
}

// 获取某用户的关注用户列表
// /users/${id}/follows/users?userId=${loginUserId}
export const fetchFollowUsers = (targetUserId: string, loginUserId?: string): Promise<any> => {
  if(loginUserId) {
    return get(`/users/${targetUserId}/follows/users?userId=${loginUserId}`)
  } else {
    return get(`/users/${targetUserId}/follows/users`)
  }
}