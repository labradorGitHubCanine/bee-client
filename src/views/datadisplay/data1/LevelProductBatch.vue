<template>
    <div class="part_table">
        <table border="1">
            <tr>
                <th>批号</th>
                <th>库存数量</th>
                <th>当日进/出</th>
                <th>30天进/出</th>
            </tr>
            <tbody>
                <tr class="seach">
                    <input placeholder="查询批号" @input="request" v-model="name">
                </tr>
                <tr v-if="items.length==0">
                    <td>未查询到信息</td>
                </tr>
                <tr v-for="i in items" :key="i.id">
                    <td>{{i.name}}</td>
                    <td>
                        {{i.amount}}
                        <small v-if="i.periodOut > 0">
                            <br>
                            可用{{((i.amount*30)/i.periodOut).toFixed(0)}}天
                        </small>
                    </td>
                    <td>
                        <div class="topNum">
                            <i>+</i>
                            {{i.todayIn}}
                        </div>
                        <div class="bottomNum">
                            <i>-</i>
                            {{i.todayOut}}
                        </div>
                    </td>
                    <td>
                        <div class="topNum">
                            <i>+</i>
                            {{i.periodIn}}
                        </div>
                        <div class="bottomNum">
                            <i>-</i>
                            {{i.periodOut}}
                        </div>
                    </td>
                </tr>
            </tbody>
            <span>{{countDown}}秒后刷新</span>
        </table>
    </div>
</template>
<script>
    import { listReportForm } from '../../../configs/axios/api/data1'
    export default {
        data() {
            return {
                items: [],
                name: "",
                interval: 30,
                intervalObject: null,
                countDown: 30,
            };
        },
        mounted() {
            this.request();
            let that = this;
            this.intervalObject = setInterval(function () {
                if (that.countDown-- < 0) {
                    that.request();
                    that.countDown = that.interval;
                }
            }, 1000);
        },
        beforeDestroy() {
            clearInterval(this.intervalObject);
        },
        methods: {
            request() {
                let params = {
                    level: 4,
                    storehouseId: this.$route.params.storehouseId,
                    id: this.$route.params.id,
                    name: this.name
                }
                listReportForm(params).then(data=>{
                    this.items = data.items;
                })
            }
        },
        computed: {
            total() {
                let sum = 0;
                for (let i = 0, item; (item = this.items[i++]);)
                    sum += parseInt(item.amount);
                return sum;
            }
        },
    };
</script>
<style scoped>
    @import '../../../assets/css/datadisplay.data1.css';

    .part_table tr th,
    .part_table tr td {
        width: 24.65%;
    }
</style>
