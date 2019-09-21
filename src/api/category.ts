import {
  get,
  post,
} from "./http"

export interface CategoryPayload {
  avatar: string,
  name: string,
  brief: string,
  sort: number,
}

export const addCategory = ({ avatar, brief, name, sort }: CategoryPayload): Promise<any> => {
  return post('/admin/categories', { avatar, brief, name, sort })
}

export const categoryList = (): Promise<any> => {
  return get('/categories')
}