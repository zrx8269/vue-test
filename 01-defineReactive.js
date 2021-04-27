function defineReactive(obj, prop, val) {
    // val有可能是对象，obj={baz: {a: 10}}
    observe(val);
    Object.defineProperty(obj, prop, {
        get(){
            console.log("get");
            return val;
        },
        set(newVal) {
            if(newVal !== val) {
                console.log("set", newVal);
                // 针对obj.baz={a:1}
                observe(newVal);
                val = newVal
            }
        }
    })
}

// 对象响应化处理
// 通过遍历对象的属性
function observe(obj) {
    // 判断obj必须是对象
    if(typeof obj !== 'object' || obj === null) {
        return;
    }
    Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]));
}

// 针对动态新添加的属性
function _set(obj, prop, key) {
    defineReactive(obj, prop, key);
}

const obj = {
    foo: 'foo',
    baz: {
        a: 1
    }
};
// 这种方法比较繁琐，一次只能定义一个属性
// defineReactive(obj, 'foo', 'foo');
observe(obj);
// obj.baz = {a: 10};
// obj.baz.a=100
// console.log(obj.baz.a);

_set(obj, 'dong', 'dong');