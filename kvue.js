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
        node.textContent = this.$vm[exp]
    }

    html(node, exp) {
        node.innerHTML = this.$vm[exp]
    }

    // 插值文本编译
    compileText(node) {
        // 获取匹配表达式
        // console.log("aaaaa", this.$vm[RegExp.$1])
        node.textContent = this.$vm[RegExp.$1];
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
        })
    }
}