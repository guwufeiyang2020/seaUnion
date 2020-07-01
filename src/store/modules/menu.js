import {
  $http
} from '@commonbox/utils';
import router from '../../router/index';

const menu = {
  state: {
    selectMenuObj: null,
    menuList: []
  },
  mutations: {
    SET_MENU: (state, selectMenu) => {
      state.selectMenuObj = selectMenu;
    },
    QUERY_MENU: (state, getMenus) => {
      state.menuList = getMenus;
    },
  },
  actions: {
    queryMenuList({
      commit
    }) {
      return new Promise((resolve, reject) => {
        $http.get('/sdkseaunion/portalApi/getUserMenu').then((res) => {
          if (res.data.status === 200) {
            let asideMenu = res.data.data;
            commit('QUERY_MENU', asideMenu);
            resolve(asideMenu);
          } else if (res.data.status === 500 && res.data.errormsg === '登录过期，请重新登录') {
            router.push({
              path: '/login'
            });
          }
        }).catch((error) => {
          reject(error);
        });
      });
    }
  },
};

export default menu;
