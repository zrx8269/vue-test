// 对象响应式原理
function defineReactive(obj, prop, val) {
    // 利用闭包

    // val有可能是对象
    observe(val);

    // 没执行一次defineReactive，就会创建一个Dep的实例
    // prop与Dep一对一
    const dep = new Dep();
    Object.defineProperty(obj, prop, {
        get(){
            console.log("get");
            Dep.target && dep.addDep((Dep.target))
            return val;
        },
        set(newVal) {
            if(newVal !== val) {
                console.log("set", newVal);
                observe(newVal);
                val = newVal;

                // 通知更新
                dep.notify();
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

        // 编译
        new Compile('#app',this);
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

// 编译过程
// new Compile(el, vm)
class Compile {
    constructor(el, vm) {
        this.$vm = vm;

        this.$el = document.querySelector(el);

        if(this.$el) {
            this.compile(this.$el);
        }
    }
    compile(el) {
        // 递归遍历el
        // 判断其类型
        el.childNodes.forEach(node => {
            if(this.isElement(node)) {
                console.log("编译元素", node.nodeName)
                this.compileElement(node);
            } else if(this.isInter(node)){
                // console.log('编译插值表达式', node.textContent)
                this.compileText(node);
            }

            if(node.childNodes) {
                this.compile(node);
            }
        })
    }
   
    // 元素
    isElement(node) {
        return node.nodeType ===1;
    }

    // 判断是否是插值表达式{{x}}
    isInter(node) {
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    isDirective(attrName) {
        return attrName.indexOf('k-') === 0;
    }

    // 文本指令
    text(node, exp) {
        // node.textContent = this.$vm[exp];
        this.update(node, exp, 'text')
    }

    html(node, exp) {
        // node.innerHTML = this.$vm[exp];
        this.update(node, exp, 'html')
    }

    htmlUpdater(node, value) {
        node.innerHTML = value;
    }

    textUpdater(node, value) {
        node.textContent = value;
    }

    // 插值文本编译
    compileText(node) {
        // 获取匹配表达式
        // console.log("aaaaa", this.$vm[RegExp.$1])
        // node.textContent = this.$vm[RegExp.$1];
        this.update(node, RegExp.$1, 'text')
    }

    compileElement(node) {
        // 获取节点属性
        const nodeAttrs = node.attributes;
        Array.from(nodeAttrs).forEach(attr => {
            // k-xxx="aaa"
            const attrName = attr.name; // k-xxx
            const exp = attr.value; // aaa
// 判断这个属性类型
            if(this.isDirective(attrName)) {
                const dir = attrName.substr(2);
// 执行指令
                this[dir] && this[dir](node, exp);
            }

            // 事件处理
            if(this.isEvent(attrName)) {
                // @click="onClick"
                const dir = attrName.substr(1);
                this.eventHandler(node, exp, dir)
            }
        })
    }

    isEvent(dir) {
        return dir.startsWith('@');
    }

    eventHandler(node, exp, dir) {
        const fn = this.$vm.$options.methods && this.$vm.$options.methods[exp];
        node.addEventListener(dir, fn.bind(this.$vm));
    }


// 所有动态绑定都需要创建更新函数以及对应watcher实例
    update(node, exp, dir) {
        // textUpdater
        // 初始化
        const fn = this[dir + 'Updater']
        fn && fn(node, this.$vm[exp])

        // 更新
        new Watcher(this.$vm, exp, function(val) {
            fn && fn(node, val)
        })
    }

    // k-model = 'xx'
    model(node, exp) {
        // update只完成赋值和更新
        this.update(node, exp, 'model')

        // 事件监听
        node.addEventListener('input', e=> {
            this.$vm[exp] = e.target.value
        })


    }

    modelUpdater(node, value) {
        // 表单元素赋值
        node.value = value
    }
}

// watcher：小秘书，界面中的一个依赖对应一个小秘书

class Watcher{
    constructor(vm, key, updateFn) {
        this.vm = vm;
        this.key = key;
        this.updateFn = updateFn

        // 读一次数据，触发defineReactive里面的get
        // 在那里面加当前watcher与dep的关系
        // Dep.target是给Dep加一个静态属性
        Dep.target = this; // 第一步
        this.vm[this.key]; // 第二步读一下
        Dep.target = null;
    }

    // 管家调用
    update() {
        // 传入当前的最新指给更新函数
        this.updateFn.call(this.vm, this.vm[this.key])
    }
}


class Dep {
    constructor() {
        this.deps = []
    }
    addDep(watcher) {
        this.deps.push(watcher)
    }
    notify() {
        this.deps.forEach(watcher => watcher.update())
    }
}