import Vue from 'vue';
import SvgIcon from '@/components/SvgIcon.vue'

// 自动化加载svg目录下所有svg文件
// 使用webpack提供的require.context()指定svg为固定上下文
// false不要递归
const req = require.context('./svg', false, /\.svg$/)
// keys()返回上下文中所有文件名
// map(req)动态的调用所有的文件名执行req
req.keys().map(req)

// 注册svg-icon组件
Vue.component('svg-icon', SvgIcon)