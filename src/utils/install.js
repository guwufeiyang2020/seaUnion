import Vue from 'vue';
// import scroll from 'vue-seamless-scroll';
import AYPlugin from '../plugins/AYPlugin';
import HttpPlugin from '../plugins/HttpPlugin';
import directives from '../directive';
// eslint-disable-next-line import/no-cycle
// import UtilsPlugin from './assets/utils/Index';
directives.install = (vue) => {
  Object.keys(directives).forEach((key) => {
    if (key !== 'install') {
      vue.directive(key, directives[key]);
    }
  });
};
Vue.use(AYPlugin);
Vue.use(HttpPlugin);
// Vue.use(UtilsPlugin);
// Vue.use(scroll);
Vue.use(directives);
