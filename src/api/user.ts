import {
  get,
  post,
  put
} from "./http"

export const fetchUser = async () : Promise<any> => {
  return get('/user')
}
// export const loginByPhone = async (phone: string, password: string): Promise<any> => {
//   return get(`/login/cellphone?phone=${phone}&password=${password}`)
// }

// export const loginByEmail = async (email: string, password: string): Promise<any> => {
//   return get(`/login?email=${email}&password=${password}`)
// }

// export const refreshLoginStatus = async (): Promise<any> => {
//   return get('/login/refresh')
// }

// export const getLoginStatus = async (): Promise<any> => {
//   return get('/login/status')
// }

// export const logout = async (): Promise<any> => {
//   return get('/logout')
// }
