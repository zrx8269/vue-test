// 1.创建vue实例
const Vue = require("vue");
const app = new Vue({
    template: '<div>hello  world</div>'
});

// 2. 创建渲染器
const {createRenderer} = require('vue-server-renderer');
const renderer = createRenderer();

// 3. 渲染
renderer.renderToString(app).then((html)=> {
    console.log(html)
}).catch(err => {
    console.log(err);
});
