import Vue from 'vue';

// 登录接口
export function loginByUsername(param) {
  return Vue.prototype.$http.post('/sdkuser/loginApi/login', param);
}


// 获取菜单应用数据接口
export function getApplist(param) {
  return this.$http.get(`/sdkuser/menuPageApi/getApplist?flag=${param.flag}&parentId=${param.parentId}&parentName=${param.parentName}`);
}
