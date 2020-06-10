require('events').EventEmitter.defaultMaxListeners = 0;

const path = require('path');
const resolve = function (dir) {
  return path.join(__dirname, dir);
};

if (!process.env.VUE_APP_ENV) {
  process.env.VUE_APP_ENV = 'development';
}

const {
  publicPath,
  babelConfig,
  externalConfig,
  devServer,
  globalConfig,
  chainWebpackPlugins,
  outputDir
} = require('./config');

function chainWebpackGloablConfig(config) {
  config.plugin('html').tap((args) => {
    args[0].templateParameters = {
      ...args[0].templateParameters,
      globalConfig,
    };
    return args;
  });
}

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/assets/styles/config.scss";`,
      }
    },
  },
  publicPath,
  devServer,
  outputDir,
  lintOnSave: true,
  filenameHashing: true,
  runtimeCompiler: true, //关键点在这
  productionSourceMap: false,
  chainWebpack: (config) => {
    // 因为vuecli 3默认开启prefetch(预先加载模块)，提前获取用户未来可能会访问的内容
    // 在首屏会把这十几个路由文件，都一口气下载了
    // 所以我们要关闭这个功能
    config.plugins.delete('preload');
    config.plugins.delete('prefetch');
    // 别名配置
    config.resolve.alias
      .set('@', resolve('src'))

    config.optimization.runtimeChunk('single');

    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()


    externalConfig.chainWebpackExternals(config);
    chainWebpackPlugins(config);
    chainWebpackGloablConfig(config);
  },

  configureWebpack: {
    externals: externalConfig.externals,
    module: {
      noParse: '/jquery|lodash/', // 不去解析三方库
      rules: [{
        test: /\.js$/,
        exclude: /node_modules/,        
	use: [{
          loader: 'babel-loader',
          options: babelConfig,
        }, ],
      }],
    },

  },
};
