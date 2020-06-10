import { encryptDes } from '@/assets/js/utils/des';

let socket;
let urlWeb;
let reLoad = false;
const config = {};
const seesion = encryptDes('2561dcb2b09d9e6cefd3cfbf4641ea6c');
if (process.env.VUE_APP_ENV === 'development') {
  // 开发路由
  config.websocketPat = 'ws://10.0.20.128:9013/sdkdsxz/websocket/zhonghuaxingzhong/';
} else if (process.env.VUE_APP_ENV === 'production') {
  // 线上路由
  config.websocketPat = 'wss://www.sinochemlogistics.com/sdkdsxz/websocket/zhonghuaxingzhong/';
} else if (process.env.VUE_APP_ENV === 'servePre') {
  config.websocketPat = 'wss://pre.sinochemlogistics.com/sdkdsxz/websocket/zhonghuaxingzhong/';
} else if (process.env.VUE_APP_ENV === 'pre') {
  config.websocketPat = 'ws://192.168.0.53:9888/sdktcp/websocket/sdkasclasses';
} else if (process.env.VUE_APP_ENV === 'demo') {
  config.websocketPat = 'ws://lets-as.demo.qpaas.com:22123/sdkdsxz/websocket/zhonghuaxingzhong/';
}
// ws://10.0.20.128:9888/sdktcp/websocket/sdkportal?ayParams=bba6d24f1b9bc8e236597c33b6ded75984c4a5ff406145a342298cf928798f653e3a612c14f6e38ca92af7b6d545c167cdc4e1e3549f4984bb8e2b5ef29d2ab5d9868dd98115e57d24fe7f88714e5bb44e3d5c6c50fea3333be36aeb8e8f927a8edc075642052cb50647eccd08f6d708
const paramaArr = [
  '/workBreth/getBerthThroughput', // 泊位吞吐量
];

// let socket;
export default function sock(cb, selfControlcallback) {
  urlWeb = `${config.websocketPat}?ayParams=${seesion}`;
  socket = new WebSocket(urlWeb);
  socket.onopen = () => {
    socket.send(paramaArr);
    console.log('%c socket1连接已建立', 'color:blue;font-weight:bold;font-size:14px');
  };
  socket.onmessage = (event) => {
    cb(JSON.parse(event.data));
  };
  socket.onclose = (e) => {
    console.log('断开原因', e);
    reConnect(cb);
  };
  if (typeof selfControlcallback === 'function') {
    selfControlcallback.call(null, socket);
  }
  return socket;
}

function reConnect(callback) {
  if (reLoad) {
    return;
  }
  reLoad = true;
  setTimeout(() => {
    createWebscoketInstance(callback);
    reLoad = false;
  }, 5000);
}

function createWebscoketInstance(callback) {
  // eslint-disable-next-line no-unused-expressions
  if (socket) socket.close();
  socket = new WebSocket(urlWeb);
  initEvent(callback);
}

function initEvent(cb) {
  socket.onclose = (e) => {
    console.log('断开原因', e);
    reConnect(cb);
  };
  socket.onopen = () => {
    socket.send(paramaArr);
    console.log('%c socket1连接已建立', 'color:blue;font-weight:bold;font-size:14px');
  };
  socket.onmessage = (event) => {
    cb(event.data);
  };
}
