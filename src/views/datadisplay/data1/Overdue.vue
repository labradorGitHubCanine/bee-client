<template>
    <div class="part_table">
        <table border="1">
            <tr>
                <th>批号</th>
                <th>产品</th>
                <th class="model">规格</th>
                <th class="amount">数量</th>
                <th>有效期</th>
            </tr>
            <tbody>
            <tr v-for="i in items" :key="i.id">
                <td>{{i.batchNum}}</td>
                <td>{{i.productName}}</td>
                <td class="model">
                    <small>
                        <small>{{i.modelName}}</small>
                    </small>
                    <small v-if="i.modelRemark.length > 0" style="color:#666">
                        <br/>
                        {{i.modelRemark}}
                    </small>
                </td>
                <td class="amount">{{i.amount}}</td>
                <td>{{i.validDate}}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
    import {list} from '../../../configs/axios/api/data1'

    export default {
        data() {
            return {
                items: [],
                type:this.$route.params.type,
            };
        },
        mounted() {
            this.request();
        },
        methods: {
            request() {
                list({storehouseId: this.$route.params.storehouseId, type:this.type }).then((res) => {
                    this.items = res.items;
                })
            }
        },
        watch:{
          // $route(){
          //     this.request();
          // }
            '$route.params.type'(){
                this.type = this.$route.params.type;
                this.request();
            }
        }
    };
</script>
<style scoped>
    @import '../../../assets/css/datadisplay.data1.css';

    .part_table tr th,
    .part_table tr td {
        width: 19.8%;
    }

    .part_table tr .model {
        width: 28.5%;
    }

    .part_table tr .amount {
        width: 10%;
    }

    tbody tr {
        padding: 10px 0px;
    }
</style>

