import Vue from 'vue';
import './icons';
import './utils/rem';

import router from './router';
import store from './store';

import '@qycloud/lego/dist/lego.css';
import './assets/styles/index.scss';

import 'babel-polyfill';
import './assets/js/install';

import VueBus from './utils/eventBus';

Vue.use(VueBus);

// import './mock';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  template: '<router-view></router-view>',
}).$mount('#app');