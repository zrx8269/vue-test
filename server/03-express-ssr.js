const express = require("express");
const Vue = require("vue");
const {createRenderer} = require('vue-server-renderer');
const renderer = createRenderer();
const app = express();

app.get('/', async (req, res) => {
    const app = new Vue({
        template: '<div>{{msg}}</div>',
        data() {
            return {
                msg: 'msg'
            }
        }
    });
    try{
        const html = await renderer.renderToString(app);
        res.send(html);
    } catch(err) {
        res.status(500).send('Internal Server Error');
    };

})

app.listen('3000', () => {
    console.log('server started');
})