<template>
    <div class="btnGroup">
        <span v-for="i in tabs" :key="i.code" :class="{active:codeCurrent===i.code}" @click="jump(i)">{{i.name}}</span>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                tabs: [
                    {code: '', name: '首页',path:''},
                    {code: 1, name: '3月内过期',path:'overdue'},
                    {code: 2, name: '3~6月过期',path:'overdue'},
                    {code: 3, name: '6~9月过期',path:'overdue'},
                    {code: 0, name: '库存不足',path:'product'},
                ],
                codeCurrent: '',
                storehouseId: this.$route.params.storehouseId,
            }
        },
        methods: {
            jump(jumpData) {
                this.codeCurrent = jumpData.code;
                if(jumpData.path == ''){
                    this.$router.push({
                        path:'/datadisplay/data1/'+this.storehouseId
                    })
                }else{
                    this.$router.push({
                        path:'/'+this.storehouseId+'/'+jumpData.path+'/'+jumpData.code
                    })
                }
            }
        }
    };
</script>
<style scoped>
    .btnGroup {
        text-align: right;
        top: 20px;
        position: relative;
        padding: 0 0.5rem;
        margin: 0 auto;
    }

    .btnGroup span {
        display: inline-block;
        font-size: 0.28rem;
        color: #fff;
        text-align: center;
        width: 18.4%;
        cursor: pointer;
        background-color: #07133e;
        line-height: 0.8rem;
        height: 0.8rem;
        top: 8px;
        position: relative;
        border-bottom: 3px solid #132a4f;
    }

    .btnGroup .active {
        width: 25%;
        background-color: #081236;
        color: #fff;
        height: 1.3rem;
        line-height: 1.3rem;
        font-size: 0.32rem;
        border: 3px solid #132a4f;
        border-bottom: none;
        top: 0;
        position: relative;
        border-image: -webkit-linear-gradient(rgb(14, 60, 159), rgb(236, 246, 228)) 20 20;
        /*border-image: -mo-linear-gradient(rgb(14, 60, 159), rgb(236, 246, 228)) 20 20;*/
        border-image: -o-linear-gradient(rgb(14, 60, 159), rgb(236, 246, 228)) 20 20;
        border-image: linear-gradient(rgb(14, 60, 159), rgb(236, 246, 228)) 20 20;
    }
</style>


