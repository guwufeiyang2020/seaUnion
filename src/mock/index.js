import Mock from 'mockjs';
import homeApi from './home';

// 设置200-2000ms延时请求数据
Mock.setup({
  timeout: '20 - 1000'
});

// 首页大屏
// 拦截的是 /home/getData
Mock.mock(/\/home\/getData/, 'get', homeApi.getHomeData);
Mock.mock(/\/home\/getEchartData/, 'get', homeApi.getEchartData);
