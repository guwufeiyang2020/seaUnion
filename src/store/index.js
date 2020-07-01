import Vue from 'vue';
import Vuex from 'vuex';
import creatPersistedstate from 'vuex-persistedstate';
import user from './modules/user';
import menu from './modules/menu';

import {
  getters
} from './getters';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  state: {
    loginDialog: false,
    isBigScreen: sessionStorage.getItem('isBigScreen') || 0,
  },
  mutations: {
    changeLoginDialog(state, isShow) {
      state.loginDialog = isShow;
    },
    TOGGLE_SCREEN: (state, val) => {
      state.isBigScreen = val;
      sessionStorage.setItem('isBigScreen', val);
    }
  },
  modules: {
    user,
    menu
  },
  getters,
  strict: debug,
  plugins: [
    creatPersistedstate({
      storage: window.localStorage,
      paths: ['user', 'menu']
    }),
  ],
});
