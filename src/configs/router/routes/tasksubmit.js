export default [
    {name: 'tasksubmit-listByCustomer', path: '/tasksubmit/listByCustomer', component: () => import('@/views/tasksubmit/ListByCustomer.vue')},
    {name: 'tasksubmit-listByProductTag', path: '/tasksubmit/listByProductTag/:taskCustomerId', component: () => import('@/views/tasksubmit/ListByProductTag.vue')},
    {name: 'tasksubmit-listTaskItem', path: '/tasksubmit/listTaskItem', component: () => import('@/views/tasksubmit/ListTaskItem.vue')},
    {name: 'tasksubmit-listByChargor', path: '/tasksubmit/listByChargor/:year', component: () => import('@/views/tasksubmit/ListByChargor.vue')},
]