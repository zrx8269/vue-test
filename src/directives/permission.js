import store from "@/store";

const permission = {
    inserted(el, binding) {
        // 获取指定的值，按钮要求的角色数组
        const {value: pRoles} = binding;

        // 获取用户角色
        const roles = store.getters && store.getters.roles;

        if(pRoles && pRoles instanceof Array && pRoles.length > 0) {
            const hasPermission = roles.some(role => {
                return pRoles.includes(role);
            })

            if(!hasPermission) {
                el.parentNode && el.parentNode.removeChild(el);
            }
        } else {
            throw new Error(`需要指定按钮要求的角色数组`);
        }

    }
}

export default permission;