import { $http } from '@commonbox/utils';
// import store from '../../store';

// const onlineUserInfo = JSON.stringify(store.state.user.userInfo);
// $http.defaults.headers.onlineUserInfo = onlineUserInfo;
// $http.interceptors.request.use((config) => {
//   if (config.method === 'get') {
//     // config.url += '?onlineUserInfo=3';
//   } else if (config.method === 'post') {
//     config.data = config.data ? config.data : {};
//   }
//   return config;
// });

export default class HttpPlugin {
  static install(Vue) {
    Vue.prototype.$http = $http;
    window.AY.http = $http;
  }
}
