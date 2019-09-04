import {
  get,
  post,
  put
} from "./http"

export const fetchUser = () : Promise<any> => {
  return get('/user')
}
// export const loginByPhone = (phone: string, password: string): Promise<any> => {
//   return get(`/login/cellphone?phone=${phone}&password=${password}`)
// }

// export const loginByEmail = (email: string, password: string): Promise<any> => {
//   return get(`/login?email=${email}&password=${password}`)
// }

// export const refreshLoginStatus = (): Promise<any> => {
//   return get('/login/refresh')
// }

// export const getLoginStatus = (): Promise<any> => {
//   return get('/login/status')
// }

// export const logout = (): Promise<any> => {
//   return get('/logout')
// }
