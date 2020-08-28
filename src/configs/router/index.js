import Vue from 'vue'
import Router from 'vue-router'
import tasksubmit from "@/configs/router/routes/tasksubmit";

Vue.use(Router);

const routes = [
    {name: 'login', path: '/', component: () => import('@/views/index/Login.vue')},
    {
        path: '/datadisplay/data2/:agencyId',
        redirect: {name: 'datadisplay/data2/intro'},
        component: () => import('@/views/datadisplay/data2/Index.vue'),
        children: [
            {name: 'datadisplay/data2/intro', path: 'intro', component: () => import('@/views/datadisplay/data2/Intro.vue')},
            {path: 'storage', component: () => import('@/views/datadisplay/data2/Storage.vue')},
            {path: 'storage/:storehouseId', component: () => import('@/views/datadisplay/data2/StorageBatch.vue')},
            {path: 'sales', component: () => import('@/views/datadisplay/data2/Sales.vue')},
            {path: 'payback', component: () => import('@/views/datadisplay/data2/Payback.vue')},
        ]
    },
    ...tasksubmit
];

const router = new Router({
    mode: 'history',
    routes
});

router.beforeEach((to, from, next) => {
    next();
});

// 路由重复防报错
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
};

export default router