import Vue from 'vue';
import './icons';
import './utils/rem';

import scroll from 'vue-seamless-scroll';
import router from './router';
import store from './store';
import MethodsPlugin from './plugins/MethodsPugin';

import '@qycloud/lego/dist/lego.css';
import './assets/styles/index.scss';

import 'babel-polyfill';
// import './assets/js/install';

import VueBus from './utils/eventBus';

Vue.use(scroll);

Vue.use(VueBus);
Vue.use(MethodsPlugin);
// import './mock';

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  template: '<router-view></router-view>',
}).$mount('#app');
