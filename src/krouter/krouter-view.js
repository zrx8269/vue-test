export default {
    render(h) {
        // console.log(this.$vnode);
        // 标记当前router-view深度
        this.$vnode.data.routerView = true;

        let depth = 0;
        let parent = this.$parent;
        while(parent && parent._routerRoot !== parent ) {
            const vnodeData = parent.$vnode ? parent.$vnode.data : {};
        
            if(vnodeData.routerView) {
                // 说明当前parent是一个router-view
                depth++;
            }
            
            parent = parent.$parent;

        }




        // 获取path对应的component
        let comp= null;
        const route = this.$router.matched[depth];
        console.log(route);
        if(route) {
            comp = route.component;
        }
        return h(comp)
    }
}