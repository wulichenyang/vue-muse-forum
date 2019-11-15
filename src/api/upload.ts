import {
  get,
  post,
} from "./http"

// 用户注册/登录之前获取公钥
// 用于node-rsa 给密码加密
export const fetchQiniuToken = (): Promise<any> => {
  return get('/upload/token')
}

export const uploadPhoto = (data: FormData, config: any): Promise<any> => {
  return post('/qiniu/uploadToQiniu', data, config, true)
}

export const deletePrePhoto = (key: string): Promise<any> => {
  return post('/qiniu/deletePhoto', { key })
}
