import Vue from 'vue';
import VueRouter from 'vue-router';
import '../utils/install';
import NProgress from 'nprogress'; // progress bar
import {
  patchGlobalConfig
} from '../services';
import store from '../store/index';
import {
  routers
} from './routers';

import 'nprogress/nprogress.css'; // progress bar style
import util from '../utils/util';

NProgress.configure({
  showSpinner: false,
});

const {
  globalConfig
} = window;

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  // base: 'globalConfig.router.base',
  base: '/see/union',
  routes: routers,
});

const whiteList = ['/login', '/404', '/appCenter'];
router.beforeEach(async(to, from, next) => {
  await patchGlobalConfig();
  NProgress.start();
  const {
    userInfo
  } = store.state.user;
  if (!util.isEmptyObject(userInfo)) { // 有token
    next();
    NProgress.done();
  } else { // 无token
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next();
      NProgress.done();
    } else {
      next('/login'); // 否则全部重定向到登录页
      NProgress.done();
    }
  }
});

window.routerInstance = router;
export default router;
