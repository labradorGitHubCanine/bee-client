export default [
    {name: 'datadisplay-overdue', path: '/:storehouseId/overdue/:type', component: () => import('@/views/datadisplay/data1/Overdue.vue')},
    {name: 'datadisplay-levelProductModel', path: '/:storehouseId/product/:id', component: () => import('@/views/datadisplay/data1/LevelProductModel.vue')},
    {name: 'datadisplay-LevelProductTag', path: '/:storehouseId', component: () => import('@/views/datadisplay/data1/LevelProductTag.vue')},
    {name: 'datadisplay-LevelProductBatch', path: '/:storehouseId/ProductBatch/:id', component: () => import('@/views/datadisplay/data1/LevelProductBatch.vue')},
    {name: 'datadisplay-LevelProduct', path: '/:storehouseId/productTag/:id', component: () => import('@/views/datadisplay/data1/LevelProduct.vue')},
]