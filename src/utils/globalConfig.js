import {
  $http
} from '@commonbox/utils';

const setUser = async () => {
  const {
    data: {
      result
    }
  } = await $http.get('/api2/user/info');
  window.globalConfig.user = result;
};

const setFileMaxSize = async () => {
  if (!window.globalConfig.maxFileSize) {
    const {
      data: {
        maxFileSize
      }
    } = await $http.get('/api/store/getUMFSize');
    window.globalConfig.maxFileSize = maxFileSize;
  }
};

const setAttachService = async () => {
  if (!window.globalConfig.attachService) {
    const {
      data: {
        result
      }
    } = await $http.get('/api2/config/setting/ATTACHMENT_S');
    window.globalConfig.attachService = result;
  }
};
export const patchGlobalConfig = async () => {
  try {
    await setUser();
    await setFileMaxSize();
    await setAttachService();
    return 200;
  } catch (e) {
    return e.response.status;
  }
};
