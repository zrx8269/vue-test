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

class KVue{
    constructor(options) {
        this.$options = options;
        this.$data = options.data;

        // 响应化处理
        observe(this.$data)
    }
}

// 每一个响应式对象，就有一个Observer实例
class Observer {}