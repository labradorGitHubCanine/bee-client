import router from "@/configs/router";

export default {
    'install': Vue => {
        Vue.prototype['$back'] = () => {
            router.back();
        };

        // 将form存入sessionStorage
        Vue.prototype['$keepThisForm'] = (data, path) => {
            sessionStorage.setItem(path ? path : router.currentRoute.name, JSON.stringify(data));
        };

        // 将form存入sessionStorage
        Vue.prototype['$getLastForm'] = () => {
            try {
                let obj = JSON.parse(sessionStorage.getItem(router.currentRoute.name));
                if (Object.prototype.toString.call(obj) === '[object Object]')
                    return obj;
                else
                    return {};
            } catch (e) {
                return {};
            }
        };

        Vue.prototype['$toJSONObject'] = (str) => {
            try {
                str = JSON.parse(String(str));
            } catch (e) {
                str = {};
            }
            if (Object.prototype.toString.call(str) === '[object Object]') {
                return str;
            } else {
                return {};
            }
        }

    }
}