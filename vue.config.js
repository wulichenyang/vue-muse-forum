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
      }
    }
  },

  // 发布环境压缩、去掉 console.log()
  configureWebpack: (config)=>{
    if(process.env.NODE_ENV === 'production'){
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }
  }
}