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
      path: '/rateList/:star?',
      name: 'rateList',
      component: () => import ('../pages/rateScore/rateScoreList.vue'),
    }, {
      path: '/historySearch',
      name: 'historySearch',
      component: () => import ('../pages/rateScore/historySearch.vue')
    }, {
      path: '/rateDetail/:mode/:shipPerson/:name/:id?',
      name: 'rateDetail',
      component: () => import ('../pages/rateScore/rateScoreDetail.vue')
    },
    {
      path: '/questionList/:wenjuanleixing',
      name: 'questionList',
      component: () => import ('../pages/question/questionList.vue')
    },
    {
      path: '/questionDetail/:mode/:name/:wenjuanleixing/:id?',
      name: 'questionDetail',
      component: () => import ('../pages/question/questionDetail.vue')
    },
    {
      path: '/appList/:module?/:appId?/:spaceId?',
      name: 'appList',
      component: () => import ('../pages/appList/appList.vue'),
      meta: {
        name: '列表页',
      },
    }, {
      path: '/detail/:module?/:appId?/:spaceId?/:form?',
      name: 'detail',
      meta: {
        name: '详情页',
      },
      component: () => import ('../pages/appDetail/FormMain.vue')
    },
    {
      path: '/iframContainer',
      name: 'iframContainer',
      component: () => import ('../pages/iframeContainer/iframeContainer.vue'),
      props: route => ({
        link: route.query.link,
        spaceId: route.query.spaceId,
      }),
    },
    ]
  },
  // 登录
  {
    path: '/login',
    name: 'login',
    component: () => import ('../pages/login/login.vue'),
  },

];
