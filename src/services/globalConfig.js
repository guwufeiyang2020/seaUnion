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

const getTargetSpeace = async(isSetUser, path) => {
  // 根据当前容器和子系统门户查询目标容器
  if (!isSetUser) {
    // window.AY.getSpaceId();
    let menuName = '';
    if (path === '/menu/OfficeSystem') {
      menuName = '/sdkoa';
    } else if (path === '/menu/WmsManagement') {
      menuName = '/sdkbm';
    } else if (path === '/menu/EmployeeDevelopment') {
      menuName = '/sdkhr';
    } else if (path === '/menu/InnovationPlatform') {
      menuName = '/sdkim';
    } else if (path === '/menu/HseManagement') {
      menuName = '/sdksm';
    } else if (path === '/menu/EmergencyPlatform') {
      menuName = '/sdkem';
    } else if (path === '/menu/DeviceHome') {
      menuName = '/sdkcm';
    }
    const params = {
      nowSpace: window.AY.getSpaceId(),
      appName: menuName
    };
    const {
      data: {
        data
      }
    } = await $http.post('/sdkuser/menuPageApi/getSpanSpaceAppMes', params);
    window.globalConfig.targetSpeace = data;
  }
};
export const patchGlobalConfig = async(isSetUser, path) => {
  try {
    // await setUser(isSetUser);
    await setFileMaxSize();
    await setAttachService();
    await getUserSpaceList(isSetUser);
    // await getTargetSpeace(isSetUser, path);
    return 200;
  } catch (e) {
    // console.log(e);
    // debugger
    return 401;
  }
};
