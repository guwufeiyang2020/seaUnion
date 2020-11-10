import { $http } from '@commonbox/utils';
import router from '../../router/index';

// http response 响应拦截器 登录过期重定向
$http.interceptors.response.use((response) => {
  // console.log('成功response', response.data.status);
  if (router.currentRoute.name !== 'login' && response && response.data && response.data.status === 403) {
    router.push({
      path: '/login'
    });
  }
  return Promise.resolve(response);
}, error =>
// console.log('失败error', error);
// console.log('router', router);
/* if (router.currentRoute.name === 'login') {
            return;
        }
        if (error && error.response && error.response.status) {
            if (error.response.status === 403) {
                router.push({
                    path: '/login'
                });
            }
        } */
  Promise.reject(error));

export default class HttpPlugin {
  static install(Vue) {
    Vue.prototype.$http = $http;
    window.AY.http = $http;
  }
}
