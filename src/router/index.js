import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'

Vue.use(VueRouter);

// 通用页面：不需要守卫，可直接访问
export const constRoutes = [
  {
    path: "/login",
    component: () => import("@/views/Login"),
    hidden: true //导航菜单忽略该项
  },
  {
    path: "/",
    component: () => import("@/views/Home.vue"),
    name: "home",
    meta: {
      title: "Home", //导航菜单项标题
      icon: "qq" //导航菜单项图标
    }
  }
]

// 权限页面：受保护页面，要求用户登录并拥有访问权限的角色才能访问
export const asyncRoutes = [
  {
    path: "/about",
    component: () => import("@/views/About.vue"),
    name: "about",
    meta: {
      title: "About",
      icon: "qq",
      roles: ['admin', 'editor']
    }
  }
];



export default new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: constRoutes
})
