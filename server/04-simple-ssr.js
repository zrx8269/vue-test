const express = require("express");
const Vue = require("vue");
const {createRenderer} = require('vue-server-renderer');
const renderer = createRenderer();
const app = express();

const Router = require('vue-router');
Vue.use(Router);

// 
const router = new Router({
    routes: [
        {
            path: '/',
            component: {
                template: '<div>Index</div>'
            }
        },
        {
            path: '/detail',
            component: {
                template: '<div>Detail</div>'
            }
        }
    ]
})

// 问题1： 路由管理
// 问题2： 交互
// 问题3： 同构开发
app.get('*', async (req, res) => {

    const app = new Vue({
        router,
        template: `
        <div>
            <router-link to="/">Index</router-link>
            <router-link to="/detail">Detail</router-link>
            <div>{{msg}}</div>
            <router-view></router-view>
        </div>`,
        data() {
            return {
                msg: 'msg'
            }
        }
    });
    try{
        // 路由跳转
        router.push(req.url)
        const html = await renderer.renderToString(app);
        res.send(html);
    } catch(err) {
        res.status(500).send('Internal Server Error');
    };

})

app.listen('3000', () => {
    console.log('server started');
})