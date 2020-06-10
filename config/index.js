const babelConfig = require('./babel');
const serverConfig = require('./server');
const externalConfig = require('./external');
const { chainWebpackPlugins } = require('./plugin');

const { router: { base: publicPath }, outputDir } = serverConfig;

module.exports = {
  publicPath,
  babelConfig,
  externalConfig,
  outputDir,
  chainWebpackPlugins,
  get globalConfig() {
    const {
      https, server, previewUrl, router,
    } = serverConfig;
    return {
      router,
      previewUrl: https ? `https://${previewUrl}` : `http://${previewUrl}`,
      server: Object.keys(server).reduce((result, key) => {
        if (key === 'root') {
          result[key] = server[key];
        } else {
          const url = server[key].replace(/\/$/, '');
          result[key] = https ? `https://${url}/` : `http://${url}/`;
        }
        return result;
      }, {}),
    };
  },
  get devServer() {
    const { https, dev: { host, port, proxies }, server: { www } } = serverConfig;
    const parseTarget = (target) => {
      if (/(http|https):\/\/([\w.]+\/?)\S*/.test(target)) {
        return target;
      }
      return https ? `https://${target}` : `http://${target}`;
    };
    const proxy = proxies.reduce((result, { path, target = www }) => {
      result[path] = {
        target: parseTarget(target),
        secure: false,
        changeOrigin: true,
        headers: {
          Connection: 'keep-alive',
        },
      };
      return result;
    }, {});
    return {
      disableHostCheck: true,
      open: true,
      compress: true,
      host,
      port,
      proxy,
      https: https ? {
        spdy: {
          protocols: ['http1.1'], // 解决 JSON 响应过大被截断的问题：https://github.com/webpack/webpack-dev-server/issues/1574
        },
      } : false,
    };
  },
};
