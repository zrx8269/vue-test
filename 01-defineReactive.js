// 数组响应式
// 1. 替换数组原型中的7个方法，push, pop, shift, unshift, splice, reverse, sort
const originalProto = Array.prototype;
// 备份一份，修改备份
const arrProto = Object.create(originalProto);

['push', 'pop','shift','unshift'].forEach(method => {
    arrProto[method] = function() {
        originalProto[method].apply(this, arguments);
        // 覆盖操作：通知更新
        console.log('数组执行' + method + '操作');
    }
})


// 对象响应式
function defineReactive(obj, prop, val) {
    // val有可能是对象，obj={baz: {a: 10}}
    observe(val);
    Object.defineProperty(obj, prop, {
        get(){
            console.log("get", val);
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

    if(Array.isArray(obj)) {
        obj.__proto__ = arrProto
        // 对数组内部元素执行响应化
        // const keys = Object.keys[obj];
        for(let i = 0; i < obj.length; i++) {
            observe(obj[i]);
        }
    } else {
        Object.keys(obj).forEach(key => defineReactive(obj, key, obj[key]));
    }
}

// 针对动态新添加的属性
function _set(obj, prop, key) {
    defineReactive(obj, prop, key);
}

const obj = {
    foo: 'foo',
    baz: {
        a: 1
    },
    arr: [1,2,3]
};
// 这种方法比较繁琐，一次只能定义一个属性
// defineReactive(obj, 'foo', 'foo');
observe(obj);
// obj.baz = {a: 10};
// obj.baz.a=100
// console.log(obj.baz.a);

_set(obj, 'dong', 'dong');
obj.arr.push(4)
obj.arr