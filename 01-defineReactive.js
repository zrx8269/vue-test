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
    Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]));
}

function _set(obj, prop, key) {
    defineReactive(obj, prop, key);
}

const obj = {
    foo: 'foo',
    baz: {
        a: 1
    }
};
// defineReactive(obj, 'foo', 'foo');
observe(obj);
// obj.baz = {a: 10};
// obj.baz.a=100
// console.log(obj.baz.a);

_set(obj, 'dong', 'dong');