// 包含路由嵌套
let KVue;
import Vue from 'vue';
import View from './krouter-view';

// 插件
// 1. 实现一个install方法
class KVueRouter {
    constructor(options) {
        this.$options = options;

        // 这个current不需要响应式了，用下面的matched
        this.current = window.location.hash.slice(1) || "/";
        Vue.util.defineReactive(this, 'matched', []);
        // match方法可以递归遍历路由表，获取匹配的路由
        this.match();

        // 监听事件
        window.addEventListener('hashchange', this.onHashChange.bind(this));
        window.addEventListener('load', this.onHashChange.bind(this));

        
        
    }
    onHashChange() {
        this.current = window.location.hash.slice(1);
        this.matched = [];
        this.match();
    }
    match(routes) {
        routes = routes || this.$options.routes;

        for(const route of routes) {
            if(route.path === "/" && this.current === "/") {
                this.matched.push(route);
                return;
            }
            // /about/info
            if(route.path !== "/" && this.current.indexOf(route.path) != -1) {
                this.matched.push(route);
                if(route.children) {
                    this.match(route.children)
                }
                return;
            }
        }
    }

}
// 形參是vue的構造函數
KVueRouter.install = function(Vue) {
    // 保存构造函数，打包的时候不把Vue打包进去
    KVue = Vue;

    // 1.挂载$router
    // 问题：install在vue.use的时候就执行了，但是vue的实例绑定在后面，怎么拿到这个实例？
    Vue.mixin({
        beforeCreate() {
            // 全局混入，将来在组件实例化的时候才执行
            // 此时router实例是不是已经存在了
            // this值的是组件实例
            if(this.$options.router){ //根组件
                Vue.prototype.$router = this.$options.router;
            }
        }
    })

    // 2.实现两个全局组件
    Vue.component('router-link', {
        // h是createElement函数
        render(h) {
            return h('a', {
                attrs: {
                    href: "#" + this.to
                }
            }, this.$slots.default)
        },
        props: {
            to: {
                type: String,
                required: true
            }
        }
    });
    Vue.component('router-view', View)
}



export default KVueRouter;