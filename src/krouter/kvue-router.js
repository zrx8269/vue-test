let KVue;

// 插件
// 1. 实现一个install方法
class KVueRouter {
    constructor(options) {
        this.$options = options;

        // 响应式数据
        const initial = window.location.hash.slice(1) || '/';
        KVue.util.defineReactive(this, 'current', initial);

        // 用这种直接赋值的方法，当切换路由时，页面没有重新渲染
        // this.current = "/";

        // 监听事件
        window.addEventListener('hashchange', this.onHashChange.bind(this));
        window.addEventListener('load', this.onHashChange.bind(this));

        // 缓存路由映射关系
        // 将routes保存到对象中，避免在router-view的render函数里每次循环查找
        this.routeMap = {};
        this.$options.routes.forEach((route) => {
            this.routeMap[route.path] = route;
        });
        
    }
    onHashChange() {
        this.current = window.location.hash.slice(1);
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
    Vue.component('router-view', {
        // h是createElement函数
        render(h) {
             // 1. 获取路由器实例
            // const routes = this.$router.$options.routes;
            // const current = this.$router.current;
            // const route = routes.find((route) => route.path === current)
            // const comp = route ? route.component : null;

// 使用routeMap避免每次循环
            const {routeMap, current} = this.$router;
            const comp = routeMap[current] ? routeMap[current].component : null;
            return h(comp)
        }
    })
}



export default KVueRouter;