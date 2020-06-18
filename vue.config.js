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
    
    // 关闭 prefetch
    config.plugins.delete('prefetch')

    config.optimization.splitChunks({
      // chunks: 'all', // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
      minSize: 30000, // 将引用模块分离成新代码文件的最小体积
      cacheGroups: {
        // vueBase: {
        //   test: /vue|vue-router|vuex/,
        //   name: 'chunk-vue',
        //   chunks: 'initial',
        //   priority: 5   // 抽取优先级
        // },
        // vueExtends: {
        //   test: /vue-class-component|vue-property-decorator|vue-class/,
        //   name: 'chunk-vue-extends',
        //   chunks: 'initial',
        //   priority: 5   // 抽取优先级
        // },
        museUIBase: {
          test: /muse-ui|muse-ui-loading|muse-ui-toast/,
          name: 'chunk-muse-ui',
          chunks: 'initial',
          priority: 8   // 抽取优先级
        },
        // elementUIBase: {
        //   test: /element-ui/,
        //   name: 'chunk-element-ui',
        //   chunks: 'initial',
        //   priority: 8   // 抽取优先级
        // },
        // emojiBase: {
        //   test: /emoji-mart-vue-fast/,
        //   name: 'chunk-emoji',
        //   chunks: 'initial',
        //   priority: 8   // 抽取优先级
        // },
        // quillBase: {
        //   test: /quill|vue-quill-editor/,
        //   name: 'chunk-quill',
        //   chunks: 'initial',
        //   priority: 8   // 抽取优先级
        // },
        utilBase: {
          test: /axios|core-js|node-rsa/,
          name: 'chunk-util',
          chunks: 'initial',
          priority: 8   // 抽取优先级
        },
        // 抽离自定义工具库
        common: {
          name: 'chunk-common',
          // 表示将引用模块如不同文件引用了2次，才能分离生成新chunk
          minChunks: 2, 
          chunks: 'initial',
          priority: 4
        }
      }
    })
  },

  publicPath: '/',
  // publicPath: process.env.NODE_ENV === 'production' ? 'http://cdn.wulichenyang.com' : '/',

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

  productionSourceMap: false,

  // 发布环境压缩、去掉 console.log()
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
    }

  },
  // 默认情况下 babel-loader 会忽略所有 node_modules 中的文件。如果你想要通过 Babel 显式转译一个依赖，可以在这个选项中列出来。
  transpileDependencies: ['muse-ui', 'node-rsa', 'safer-buffer'] // 增加babel编译配置选项，编译ES6，添加新API在IE9等低版本环境下
}