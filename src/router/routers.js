import Layout from '../layout/Layout.vue';

export const routers = [
  // 带头部，尾部页面
  {
    path: '/',
    name: 'home',
    redirect: '/index',
    component: Layout,
    children: [{
      path: '/index',
      name: 'index',
      component: () => import ('../pages/shipInfo/shipInfo.vue')
    },
    {
      path: '/bigScreen',
      name: 'bigScreen',
      component: () => import ('../pages/shipInfo/shipInfoBigScreen.vue')
    },
    {
      path: '/rateList',
      name: 'rateList',
      component: () => import ('../pages/rateScore/rateScoreList.vue'),
    }, {
      path: '/historySearch',
      name: 'historySearch',
      component: () => import ('../pages/rateScore/historySearch.vue'),
    }, {
      path: '/rateDetail/:id/:mode',
      name: 'rateDetail',
      component: () => import ('../pages/rateScore/rateScoreDetail.vue')
    },
    {
      path: '/questionList',
      name: 'questionList',
      component: () => import ('../pages/question/questionList.vue')
    },
    {
      path: '/questionDetail/:id/:mode',
      name: 'questionDetail',
      component: () => import ('../pages/question/questionDetail.vue')
    },
    ]
  },
  // 登录
  {
    path: '/login',
    name: 'login',
    meta: {
      name: '登录',
    },
    component: () => import ('../pages/login/login.vue'),
  },
];
