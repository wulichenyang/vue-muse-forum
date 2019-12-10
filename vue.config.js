const path = require('path')

function resolve(dir) {
  return path.join(__dirname, './', dir)
}

module.exports = {
  chainWebpack: config => {
    // 为src下文件配别名，不使用相对路径
    // config.resolve.alias
    //   .set('@', resolve('src'))
    //   .set('assets', resolve('src/assets'))
    //   .set('components', resolve('src/components'))
    //   .set('views', resolve('src/views'))
    //   .set('icons', resolve('src/icons'))
    //   .set('router', resolve('src/router'))
    //   .set('utils', resolve('src/utils'))
    //   .set('style', resolve('src/style'))
  },

  publicPath: '/',

  /* 开发环境代理 */
  devServer: {
    proxy: {
      '/muse-forum-api-v1': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true //是否跨域
      },
      // 七牛云代理
      // 上传图片
      '/qiniu/uploadToQiniu': {
        target: "http://upload-z2.qiniup.com",
        ws: true,
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/qiniu/uploadToQiniu': '/'
        }
      },
      //删除图片
      '/qiniu/removeFromQiniu': {
        target: "http://rs.qiniu.com",
        ws: true,
        changeOrigin: true, //是否跨域
        pathRewrite: {
          '^/qiniu/removeFromQiniu': '/'
        }
      }
    }
  },

  // 发布环境压缩、去掉 console.log()
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  },
  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  transpileDependencies: ['muse-ui', 'node-rsa', 'safer-buffer'] // 增加babel编译配置选项，编译ES6，添加新API在IE9等低版本环境下
}