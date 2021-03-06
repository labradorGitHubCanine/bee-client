import Vue from 'vue'
import App from './App.vue'
import router from '@/configs/router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import func from './configs/global/func'
import 'lib-flexible/flexible.js'

Vue.use(func);
Vue.config.productionTip = false;
Vue.use(ElementUI, {size: 'small'});

Vue.config.productionTip = false

new Vue({
    router,
    'render': h => h(App),
}).$mount('#app')
