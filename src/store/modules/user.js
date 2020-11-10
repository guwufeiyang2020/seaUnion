import {
  $http
} from '@commonbox/utils';
import router from '../../router/index';

const user = {
  state: {
    userInfo: {},
  },
  mutations: {
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
    },
  },
  actions: {
    login({ commit }, loginForm) {
      return new Promise((resolve, reject) => {
        $http.post('/sdkseaunion/loginApi/login', loginForm).then((res) => {
          if (res.data) {
            resolve(res.data);
          }
        }).catch((error) => {
          reject(error);
        });
      });
    },

    layout({ commit }) {
      return new Promise((resolve, reject) => {
        $http.post('/sdkseaunion/loginApi/exit').then((res) => {
          if (res.data.status === 200 && res.data.data.flag === true) {
            commit('SET_USER_INFO', {});
            router.push({
              path: '/login'
            });
          }
        });
      });
    },
    getUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        $http.get('/sdkseaunion/userApi/getUserInfo').then((res) => {
          if (res.data.status === 200) {
            const { data } = res.data;
            commit('SET_USER_INFO', data);
          } else if (res.data.status === 500 && res.data.errormsg === '登录过期，请重新登录') {
            router.push({
              path: '/login'
            });
          }
        });
      });
    },
  }
};

export default user;
