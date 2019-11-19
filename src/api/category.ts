import {
  get,
  post,
  put,
} from "./http"

export interface CategoryPayload {
  avatar: string,
  name: string,
  brief: string,
  sort: number,
}

export interface UpdateCategoryPayload {
  id: string
  avatar: string,
  name: string,
  brief: string,
  sort: number,
}

export const addCategory = ({ avatar, brief, name, sort }: CategoryPayload): Promise<any> => {
  return post('/admin/categories', { avatar, brief, name, sort })
}

export const fetchCategoryList = (): Promise<any> => {
  return get('/categories')
}

export const fetchCategoryHeaderDetail = (categoryId: string, userId?: string): Promise<any> => {
  if (userId) {
    return get(`/categories/${categoryId}?userId=${userId}`)
  } else {
    return get(`/categories/${categoryId}`)
  }
}

export const updateCategory = ({ avatar, brief, name, sort, id }: UpdateCategoryPayload): Promise<any> => {
  return put(`/admin/categories/${id}`, { avatar, brief, name, sort })
}
