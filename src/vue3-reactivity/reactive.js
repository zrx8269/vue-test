// Proxy

const isObject = v=> v!=null && typeof v==='object';

function reactive(obj) {
    return new Proxy(obj, {
        get(target, key, receiver) {
            const ret = Reflect.get(target, key, receiver);
            console.log('get', key);
            track(target, key);
            return isObject(ret) ? reactive(ret) : ret
        },
        set(target, key, value, receiver) {
            const ret = Reflect.set(target, key, value, receiver);
            console.log("set", key);
            trigger(target, key);
            return ret;
        },
        deleteProperty(target, key) {
            const ret = Reflect.deleteProperty(target, key);
            console.log('delete');
            trigger(target, key);
            return ret;
        }
    })
}
// 声明一个响应的函数，放入effectStack备用
const effectStack = [];
function effect(fn) {
    const rxEffect = function() {
        // 1. 捕获异常
        // 2. fn入栈出栈
        // 3. 执行fn
        console.log('rxEffect');
        try {
            effectStack.push(rxEffect);
            return fn();
        }finally {console.log("finally")
            effectStack.pop();

        }
    }

    // 执行一次,就会触发getter
    rxEffect();
    return rxEffect;
}

// 响应函数触发某个响应式数据，开始做依赖收集（映射过程）
// 定义管家
const targetMap = new WeakMap()
function track(target, key) {
    const effect = effectStack[effectStack.length - 1];
    if(effect) {
        let depsMap = targetMap.get(target);
        if(!depsMap) {
            depsMap = new Map();
            targetMap.set(target, depsMap)
        } 
        // 存在则获取之，第一次可能为空，需要创建一个set
        let deps = depsMap.get(key);

        if(!deps) {
            deps = new Set();
            depsMap.set(key, deps);
        }
        // 把响应函数放入集合
        deps.add(effect);
    }
}
// setter或者deleteProperty触发时，根据映射关系执行cb
// 有点像之前的notify
function trigger(target, key){
    const depsMap = targetMap.get(target);
    if(depsMap) {
        const deps = depsMap.get(key);
        if(deps) {
            deps.forEach(effect => effect());
        }
    }
}

// state就是proxy实例
const state = reactive({foo: 'foo', obj: {e: 1}, arr: [1,2,3]});
// state.foo
// state.foo = 'foo-update';

// state.arr.push(4);
// state.obj.e;

effect(() => {
    console.log("effect", state.foo)
});

state.foo="foooooooo"