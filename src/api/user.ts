import {
  get,
  post,
  put
} from "./http"

export enum ByType {
  PHONE = 'phone',
  EMAIL = 'email'
}

export interface SignUpUser {
  phone?: string,
  email?: string,
  nickname: string,
  password: string
}

export interface SignInUser {
  phone?: string,
  email?: string,
  password: string,
}

export const fetchUser = () : Promise<any> => {
  return get('/userself')
}

// 用户注册/登录之前获取公钥
// 用于node-rsa 给密码加密
export const fetchPublicKey = () : Promise<any> => {
  return get('/publicKey')
}

export const signUp = (by: ByType, data: SignUpUser) : Promise<any> => {
  return post(`/signup?by=${by}`, data)
}

export const signIn = (by: ByType, data: SignInUser) : Promise<any> => {
  return post(`/signin?by=${by}`, data)
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
