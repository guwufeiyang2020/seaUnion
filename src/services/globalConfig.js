import {
  $http
} from '@commonbox/utils';

const setUser = async(isSetUser) => {
  if (!window.globalConfig.user || isSetUser) {
    const {
      data: {
        result
      }
    } = await $http.get('/api2/user/info');
    window.globalConfig.user = result;
    window.globalConfig.user.id = result.userId;
    window.globalConfig.user.name = result.realName;
  }
};

const setFileMaxSize = async() => {
  if (!window.globalConfig.maxFileSize) {
    const {
      data: {
        maxFileSize
      }
    } = await $http.get('/api/store/getUMFSize');
    window.globalConfig.maxFileSize = maxFileSize;
  }
};

const setAttachService = async() => {
  if (!window.globalConfig.attachService) {
    const {
      data: {
        result
      }
    } = await $http.get('/api2/config/setting/ATTACHMENT_S');
    window.globalConfig.attachService = result;
  }
};
const getUserSpaceList = async(isSetUser) => {
  if (!window.globalConfig.container || isSetUser) {
    const {
      data: {
        data
      }
    } = await $http.get('/sdkuser/menuPageApi/getUserSpaceList');
    window.globalConfig.container = data;
  }
};

export const patchGlobalConfig = async(isSetUser, path) => {
  try {
    await setUser(isSetUser);
    await setFileMaxSize();
    await setAttachService();
    await getUserSpaceList(isSetUser);
    // await getTargetSpeace(isSetUser, path);
    return 200;
  } catch (e) {
    console.log(e);
    // debugger
    return 401;
  }
};
