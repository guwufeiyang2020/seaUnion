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
    login({
      commit
    }, loginForm) {
      return new Promise((resolve, reject) => {
        $http.post('/sdkseaunion/loginApi/login', loginForm).then((res) => {
          if (res.data.status === 200) {
            console.log(res);
            resolve(res.data);
          } else {
            this.$notify.error({
              title: '错误提示',
              message: res.data.errormsg,
            });
          }
        }).catch((error) => {
          reject(error);
        });
      });
    },

    layout({
      commit
    }) {
      return new Promise((resolve, reject) => {
        $http.post('/assso/loginApi/exit').then((res) => {
          if (res.data.status === 200 && res.data.data.flag === true) {
            commit('SET_USER_INFO', {});
            router.push({
              path: '/login'
            });
          }
        });
      });
    },
    getUserInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        $http.get('/assso/userApi/getUserInfo').then((res) => {
          const {
            data
          } = res.data;
          commit('SET_USER_INFO', data);
        });
      });
    },
  }
};

export default user;
