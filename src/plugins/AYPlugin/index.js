import {
  buildSpaceUri,
  getSpaceIdByUri,
  getSpaceInfoFromUrl,
  buildSpaceUriById,
} from '@qycloud/cube';
import {
  createMessager
} from '@qycloud/lego';
import get from './get';
import log from './log';
import createLoaderHTML from './createLoaderHTML';
import createLoader from './createLoader';
import importModule from './importModule';

export const $AY = {
  openRoute(url) {
    window.routerInstance.push(url);
  },
  replaceRoute(url) {
    const prefix = `${window.location.protocol}//${window.location.host}${window.globalConfig.router.base}`;
    window.routerInstance.replace(url.replace(prefix, '/'));
  },
  updateRoute(url) {
    window.routerInstance.replace(url);
  },
  backRoute() {
    window.routerInstance.back();
  },
  canRouteGoBack() {
    return true;
  },
};

window.AY = {
  log,
  get,
  createLoaderHTML,
  createLoader,
  import: importModule,
  buildSpaceUri,
  getSpaceIdByUri,
  createMessager,
  getSpaceId() {
    return window.AY.get('user.entId');
  },
  getSpaceInfoOfCurrentPage() {
    const url = window.location.pathname;
    const info = getSpaceInfoFromUrl(url);
    if (info) return info;

    const spaceId = window.AY.get('user.entId');
    const spaceUri = buildSpaceUriById(spaceId);
    return {
      spaceId,
      spaceUri,
    };
  },
};

export default class AYPlugin {
  static install(Vue) {
    Vue.prototype.$AY = $AY;
    window.$AY = $AY;
  }
}
