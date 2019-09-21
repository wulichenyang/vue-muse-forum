/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from "axios";
import { ApiConfig } from "../config/index"
import Toast from 'muse-ui-toast'
import cookie from '../utils/cookie';
import { access_token } from "../config";
import router from '@/router'
import store from '../store/index';

/**
 * 跳转主页面
 */
const toHome = () => {
  router.replace({
    path: '/',
  });
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status: number, msg: string) => {
  // 状态码判断
  switch (status) {
    // 500: Internal Server Error 服务器内部错误
    case 500:
      msg = msg === "" ? '500 服务器内部错误' : msg
      // Toast('500 服务器内部错误')
      Toast.error(msg)
      break;
    // 501: Not Implemented
    case 501:
      msg = msg === "" ? '501 不被服务器支持' : msg
      // Toast('501 请求错误')
      Toast.error(msg)
      break;
    // 502: 错误网关 Bad Gateway
    case 502:
      msg = msg === "" ? '502 错误网关' : msg
      // Toast('502 错误网关')
      Toast.error(msg)
      break;
    // 400: bad request
    case 400:
      msg = msg === "" ? '400 错误请求' : msg
      // Toast('400 错误的请求')
      Toast.error(msg)
      break;
    case 401:
      msg = msg === "" ? '401 未登录授权' : msg
      store.dispatch('clearUser')
      cookie.removeCookie(access_token)
      // Toast('401 未登录/登录超时')
      Toast.error(msg)
      toHome();
      console.log("401")
      // 清除vuex里用户登录信息
      // 返回登录界面
      break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      msg = msg === "" ? '403 无访问权限' : msg
      // Toast('403 无访问权限')
      Toast.error(msg)
      console.log("403 无访问权限");
      break;
    // 404请求不存在
    case 404:
      msg = msg === "" ? '404 请求资源不存在' : msg
      // Toast('404 请求的资源不存在')
      Toast.error(msg)
      console.log("请求的资源不存在");
      break;
    case 301:
      msg = msg === "" ? '301 资源永久移动' : msg
      // 301 Moved Permanently
      Toast.error(msg)
      console.log("301 Moved Permanently")
      break;
    default:
      msg = msg === "" ? 'API 请求错误' : msg
      Toast.error(msg)
      console.log('http: default error: ' + msg);
  }
}

// 创建axios实例
const instance = axios.create({ timeout: 1000 * 12 });
// 设置CORS头部携带cookie
instance.defaults.withCredentials = true
// 设置post请求头
instance.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  (config: any) => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。

    const token = cookie.getCookie(access_token);
    token && (config.headers["Authorization"] = `Bearer ${token}`);
    return config;
  },
  (error: any) => (Promise as any).error(error)
)

// 响应拦截器
instance.interceptors.response.use(
  // 请求成功
  (res: Ajax.AxiosResponse) => res.status === 200 ? Promise.resolve(res.data) : Promise.reject(res),
  // 请求失败
  (error: any) => {
    const { response } = error;
    // response 是axio返回的对象
    // response.data是服务器返回的对象
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message || '');
      return Promise.reject(response);
    } else {
      // 处理断网的情况
      // eg:请求超时或断网时，更新state的network状态
      // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
      // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
      // store.commit('changeNetwork', false);
    }
  });
/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} config [请求时携带的参数]
 * @return {Promise<T>} AxioResponse [返回数据]
 */
export async function get(url: string, config?: object) {
  // try {
  // 有错误处理拦截器
  return instance.get(ApiConfig.apiPrefix + url,
    config)
  // } catch (error) {
  //   console.error("Api request error: " + error)
  //   return new Promise((r, f) => {
  //     return f({
  //       data: {},
  //       message: "Get Api request error",
  //       code: 1,
  //     })
  //   })
  // }
}
/**
 * delete方法，对应delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} config [请求时携带的参数]
 * @return {Promise<T>} AxioResponse [返回数据]
 */
export function del(url: string, config?: object) {
  // try {
  // 有错误处理拦截器
  return instance.delete(ApiConfig.apiPrefix + url,
    config)
}
/**
* post方法，对应post请求
* @param {String} url [请求的url地址]
* @param {Object} config [请求时携带的参数]
@return {Promise<T>} AxioResponse [返回数据]
*/
// 有错误处理拦截器
export function post(url: string, data: object, config?: object, clearApiPrefix?: boolean) {
  if (clearApiPrefix) {
    return instance.post(url, data, config)
  }
  return instance.post(ApiConfig.apiPrefix + url, data, config)
}
/**
* put方法，对应put请求
* @param {String} url [请求的url地址]
* @param {Object} config [请求时携带的参数]
@return {Promise<T>} AxioResponse [返回数据]
*/
export function put(url: string, data: object, config?: object) {
  return instance.put(ApiConfig.apiPrefix + url, data, config)
}

// export default instance;
