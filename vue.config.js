// node
const resolve = dir => require('path').join(__dirname, dir);

console.log(process.env.foo); // bar
console.log(process.env.VUE_APP_DONG); // dong
module.exports = {
    publicPath: '/best-practice',
    devServer: {
        port: 7070
    },
    // webpack
    // configureWebpack: {
    //     name: 'vue项目最佳实践',
    //     resolve: {
    //         alias: {
    //             comps: require('path').join(__dirname, 'src/components')
    //         }
    //     }
    // }
    configureWebpack: config => {
        config.resolve.alias.comps = require('path').join(__dirname, 'src/components');
        // 环境变量
        if(process.env.NODE_ENV === 'development') {
            config.name = 'vue best practice';
        } else {
            config.name = 'vue最佳实践';
        }
    },
    chainWebpack(config) {
        // 1.项目中默认svg加载rule排除掉icons/svg目录

        config.module.rule('svg')
            .exclude.add(resolve('src/icons'))
        // 2. svg-loader 配置
        // vue inspect命令检查webpack配置
        // vue inspect > output.json
        // vue inspect --rule svg
        config.module.rule('icons')
        .test(/\.svg$/)
        .include.add(resolve('src/icons'))
        .end() //做的时候有可能破坏了上下文，做完之后需要回退
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader')
        .options({
            symbolId: 'icon-[name]'
        })


    }
}