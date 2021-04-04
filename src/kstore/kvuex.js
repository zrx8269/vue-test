let KVue;
// 实现store类
class Store {
    constructor(options) {
       
        // 保存mutations
        this._mutations = options.mutations;
        this._actions = options.actions;
        this._wrappedGetters = options.getters;
        // 定义computed选项
        const computed = {};
        this.getters = {};

        // getters接受的是有state参数的，而computed是没有参数的
        const store = this;
        Object.keys(this._wrappedGetters).forEach(key => {
            // 获取用户定义的getter
            const fn = store._wrappedGetters[key];
            computed[key] = function() {
                return fn(store.state);
            }
            // 给getters定义只读
            Object.defineProperty(store.getters, key, {
                get: () => store._vm[key]
            })
        })
        // 响应式的state
        this._vm = new KVue({
            data: {
                // 代理属性
                // 加上$$, 既要对state做响应式，还不做代理
                $$state: options.state
            },
            computed
        });

        // 绑定this到store实例
        // const store = this;
        const {commit, dispatch} = store
        this.commit = function boundCommit(type, payload) {
            commit.call(store, type, payload);
        };

        this.dispatch = function boundDispatch(type, payload) {
            return dispatch.call(store, type, payload);
        };

        // getters
        // 1.b遍历用户传入getters所有key，动态赋值，其值应该是函数执行结果
        // 2. 确保他是响应式的，Object.defineProperty(this.getters, key, {get() {}})
        // 3. 缓存结果，可以利用computed

         
    }
    get state() {
        return this._vm._data.$$state
    }
    set state(v) {
        console.error("please use replaceState to set state")
    }
    // commit(type, payload): 执行mutation，修改状态
    commit(type, payload) {
        // 根据type获取mutation
        const entry = this._mutations[type];
        if(entry) {
            entry(this.state, payload);
        } else {
            console.error("unknown mutation type");
            return;
        }
    }
    // dispatch(type, payload)
    dispatch(type, payload) {
        const entry = this._actions[type];
        if(!entry) {
            console.error("unknown action type");
            return;
        }

        // 注意this指向
        return entry(this, payload);
    }
}
// 实现插件
function install(Vue) {
    KVue = Vue;
    Vue.mixin({
        beforeCreate() {
            if(this.$options.store) {
                Vue.prototype.$store = this.$options.store;
            }
        }
    });
}

// 此处导出的对象理解为vuex
export default {
    Store, install
}
