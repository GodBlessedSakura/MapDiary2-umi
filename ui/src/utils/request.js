import { extend } from 'umi-request'
import { message, notification } from 'antd'
import { history } from 'umi'
import jwtDecode from 'jwt-decode'
import { getTokens, clearTokens, setTokens } from './token'

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  400: '发出的请求体有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求的格式不可得。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
}

/**
 * 异常处理程序
 */
const errorHandler = (error) => {
  const { response } = error
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText
    const { status, url } = response
    // 处理参数问题
    let noParamUrl = url
    if (url.indexOf('?') !== -1) {
      noParamUrl = url.substring(0, url.indexOf('?'))
    }

    // 如果调用接口去获取token报错,则证明是账号有误
    if (url.indexOf('/login') !== -1) {
      notification.error({
        // message: `请求错误 [20002]: ${noParamUrl}`,
        message: '账号不存在或密码错误',
        // description: '账号不存在或密码错误',
      })
      return response
    }

    if (status === 401) {
      notification.warning({
        message: '请重新登陆!',
      })
      clearTokens()
      history.push('/login')
    } else {
      notification.error({
        message: `请求错误 [${status}]: ${noParamUrl}`,
        description: errorText,
      })
    }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    })
  }
  return Promise.reject(error)
}

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  prefix: '/api',
  credentials: 'include', // 默认请求是否带上cookie
  timeout: 20000,
})

/**
 * 所有请求拦截器
 * 拦截器：在request和response被then和catch处理前，进行拦截。
 */
request.interceptors.request.use((url, options) => {
  // 请求发送前，判断access_token是否过期,若过期则使用refresh_token
  // const jwtNotRequiredUrls = ['/api/registration', '/api/login']
  let token = null
  // 业务代码需要携带token; 注意新用户直接访问主页需要直接让其跳转至登录 / 注册页
  const { accessToken, refreshToken } = getTokens()
  if (accessToken && refreshToken) {
    const { exp } = jwtDecode(accessToken)
    const curTime = Date.now()
    token = curTime > exp * 1000 ? refreshToken : accessToken
  } else {
    // token 不全，重新登录
    history.push('/login')
  }
  return {
    url,
    options: {
      ...options,
      headers: {
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
  }
})

/**
 * 所有响应拦截器
 */
request.interceptors.response.use(async (response, options) => {
  const data = await response.clone().json()
  const { username, access_token: accessToken, refresh_token: refreshToken } = data
  setTokens(username, accessToken, refreshToken)

  return response
})

export default request
