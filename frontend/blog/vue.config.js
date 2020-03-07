module.exports = {
    lintOnSave: false,//关闭eslint
    outputDir:"../../backend/static/blog",
    publicPath:"/blog/",
    assetsDir:"assets",
    productionSourceMap:false,
    pwa:{
        iconPaths:{
            favicon32: 'icon.ico',
            favicon16: 'icon.ico',
            appleTouchIcon: 'icon.ico',
            maskIcon: 'icon.ico',
            msTileImage: 'icon.ico'
        }
    },
    pages: {
        front: {
          // page 的入口
          entry: 'src/front/main.js',
          // 模板来源
          template: 'public/index.html',
          // 在 dist/index.html 的输出
          filename: 'index.html',
          // 当使用 title 选项时，
          // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
          title: "liguanqing's Blog"
          // 在这个页面中包含的块，默认情况下会包含
          // 提取出来的通用 chunk 和 vendor chunk。
          //   chunks: ['chunk-vendors', 'chunk-common', 'index']
        },
        admin: {
            // page 的入口
            entry: 'src/admin/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'admin/index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: "Blog Edit Admin"
            // 在这个页面中包含的块，默认情况下会包含
            // 提取出来的通用 chunk 和 vendor chunk。
            //   chunks: ['chunk-vendors', 'chunk-common', 'index']
        }
    }
}