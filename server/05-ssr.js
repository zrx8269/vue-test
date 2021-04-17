const express = require("express");
const app = express();

const {createBundleRenderer} = require('vue-server-renderer');

//获取绝对地址
const resolve = dir => require('path').resolve(__dirname, dir);

// 静态文件服务
// 开放dist/client，关闭默认的index页面打开功能
app.use(express.static(resolve('../dist/client'), {index: false}))

// 获取渲染器
// 服务端打包文件地址
// 参数1：服务端的bundle，告诉渲染器将来怎么工作的，renderer执行工作说明书
// clientManifest： 静态文件清单列在html上
// template： 文件追加到哪个文件
const bundle = resolve('../dist/server/vue-ssr-server-bundle.json')
const renderer = createBundleRenderer(bundle, {
    runInNewContext: false, // https://ssr.vuejs.org/zh/api/#runinnewcontext
    template: require('fs').readFileSync(resolve("../public/index.html"), "utf-8"), // 宿主文件
    clientManifest: require(resolve("../dist/client/vue-ssr-client-manifest.json")) // 客户端清单
  });



// 只做一件事：渲染
app.get('*', async (req, res) => {
    try{
        const context = {
            url: req.url
        };
        const html = await renderer.renderToString(context);
        res.send(html);
    } catch(err) {
        res.status(500).send('Internal Server Error');
    };

})

app.listen('3000', () => {
    console.log('server started');
})