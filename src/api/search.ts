import {
  get,
} from "./http"

export const searchPostListOrUserOrCategory = (payload: { searchKey: string | string[], userId?: string | null }): Promise<any> => {
  const {
    searchKey,
    userId
  } = payload

  if (userId) {
    return get(`/search?key=${searchKey}&userId=${userId}`)
  } else {
    return get(`/search?key=${searchKey}`)
  }
}