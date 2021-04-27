// 对象响应式原理
function defineReactive(obj, prop, val) {
    // val有可能是对象
    observe(val);
    Object.defineProperty(obj, prop, {
        get(){
            console.log("get");
            return val;
        },
        set(newVal) {
            if(newVal !== val) {
                console.log("set", newVal);
                observe(newVal);
                val = newVal
            }
        }
    })
}

// 对象响应化处理
function observe(obj) {
    // 判断obj必须是对象
    if(typeof obj !== 'object' || obj === null) {
        return;
    }
    new Observer(obj);
    // Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]));
}

// 设置一层代理，这样在UI层，可以直接访问data中的属性，this.prop, 而不用加this.$data.prop
// 将$data中的key代理到KVue实例上
function proxy(vm) {
    Object.keys(vm.$data).forEach(key => {
        Object.defineProperty(vm, key, {
            get() {
                return vm.$data[key]
            },
            set(v) {
                vm.$data[key] = v;
            }
        })
    })
}

class KVue{
    constructor(options) {
        this.$options = options;
        this.$data = options.data;

        // 响应化处理
        observe(this.$data)

        // 代理
        proxy(this)
    }
}

// 每一个响应式对象，就有一个Observer实例
// 主要作用是object的类型做不同的操作，这里没有展示
class Observer {
    constructor(value) {
        this.value = value;

        // 判断value是obj还是数组
        this.walk(value)
    }
    walk(obj) {
        Object.keys(obj).forEach(
            key => defineReactive(obj, key, obj[key]
        ));
    }
}