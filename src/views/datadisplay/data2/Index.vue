<template>
    <div class="dataIndex">
        <div class="mainIndex">
            <br>
            <div style="display: flex; justify-content: space-between;">
                <div style="color:rgb(32, 155, 171);font-weight:bold;letter-spacing:1px;">{{date}}</div>
                <div class="selectBox">
                    <el-select value="" placeholder="切换企业" v-model="agencyId" @change="_switch" style="width: 100%;">
                        <el-option v-for="i in agencies" :key="i.id" :value="i.id" :label="i.name"></el-option>
                    </el-select>
                </div>
            </div>
            <br>
            <el-menu mode="horizontal" router :default-active="this.$route.fullPath">
                <el-menu-item :index="root('intro')">公司介绍</el-menu-item>
                <el-menu-item :index="root('storage')">公司库存</el-menu-item>
                <el-menu-item :index="root('sales')">销售数据</el-menu-item>
                <!--                <el-menu-item :index="root('payback')">单位回款</el-menu-item>-->
            </el-menu>
            <br>
            <router-view></router-view>
        </div>
    </div>
</template>
<script>
    import {silentLogin} from '@/configs/axios/api/user'
    import {list} from "@/configs/axios/api/agency";

    export default {
        mounted() {
            // 每秒刷新时间
            let that = this;
            this.interval = setInterval(() => {
                let date = new Date();
                let week = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()];
                that.date = [date.toLocaleString(), week].join(' ');
            }, 1000);
            // 静默登录
            this.silentLogin();
        },
        beforeDestroy() {
            // 组件销毁前清除定时器
            if (this.interval)
                clearInterval(this.interval);
        },
        data() {
            return {
                interval: null,
                date: null,
                agencyId: +atob(this.$route.params.agencyId),
                agencies: []
            }
        },
        methods: {
            root(uri) {
                return '/datadisplay/data2/' + this.$route.params.agencyId + '/' + uri;
            },
            silentLogin() {
                silentLogin(this.$route.params.agencyId).then(() => {
                    list({sameGroup: true}).then(data => this.agencies = data['records']);
                });
            },
            _switch(e) {
                this.$router.replace('/datadisplay/data2/' + btoa(e));
                this.silentLogin();
            }
        }
    }
</script>
<style scoped>
    @import '../../../assets/css/datadisplay.data2.css';

    .dataIndex {
        width: 100%;
        height: auto;
        min-height: 100vh;
        background-image: url("../../../assets/images/indexBg.png");
        background-size: 100% 100%;
        background-repeat: repeat-y;
        background-position: center center;
    }

    .mainIndex {
        width: 90%;
        margin: 0 auto;
    }

    .selectBox {
        width: 300px;
    }
</style>