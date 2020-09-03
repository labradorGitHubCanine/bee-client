<template>
    <div>
        <div style="color: white">{{detail.name}}</div>
        <el-table :data="records" border row-key="id" @sort-change="sort" v-loading="loading">
            <el-table-column prop="id" label="ID" sortable="custom"></el-table-column>
            <el-table-column prop="productModel.product.name" label="产品名称" sortable="custom"></el-table-column>
            <el-table-column prop="productModel.name" label="规格型号" sortable="custom">
                <template slot-scope="scope">
                    {{scope.row['productModel'].name}}<br/>
                    <small style="color:blueviolet">{{scope.row['productModel']['remark']}}</small>
                </template>
            </el-table-column>
            <el-table-column prop="num" label="批号" sortable="custom"></el-table-column>
            <el-table-column prop="storehouseBatchRel.amount" label="数量" sortable="custom"></el-table-column>
            <el-table-column prop="prodDate" label="生产日期" sortable="custom"></el-table-column>
            <el-table-column prop="validDate" label="有效期" sortable="custom"></el-table-column>
            <el-table-column prop="storehouseBatchRel.checkTime" label="最近盘点" sortable="custom">
                <template slot-scope="scope">
                    {{scope.row['storehouseBatchRel']['checker'].name}}<br/>
                    {{scope.row['storehouseBatchRel']['checkTime'].concat(' '.repeat(10)).substring(0, 10)}}
                </template>
            </el-table-column>
            <el-table-column prop="storehouseBatchRel.amountCheck" label="盘点数量/系统数量" sortable="custom">
                <template slot-scope="scope">
                    {{scope.row['storehouseBatchRel']['amountCheck']}}/{{scope.row['storehouseBatchRel']['amountSystem']}}
                </template>
            </el-table-column>
        </el-table>
        <br>
        <el-pagination
                background
                layout="total, prev, pager, next, jumper"
                :total="total"
                :current-page.sync="form['pageNum']"
                :page-size.sync="form.pageSize"
                @current-change="jump"
        ></el-pagination>
    </div>
</template>
<script>
    import {list} from '@/configs/axios/api/batch'
    import {detail} from "@/configs/axios/api/storehouse";
    import {silentLogin} from "@/configs/axios/api/user";

    export default {
        mounted() {
            silentLogin(this.$route.params.agencyId).then(() => {
                this.list();
                detail(this.form.storehouseId).then(data => this.detail = data);
            });
        },
        data() {
            return {
                detail: {},
                loading: false,
                total: 0,
                records: [],
                form: {
                    storehouseId: this.$route.params.storehouseId
                }
            }
        },
        methods: {
            list() {
                this.loading = true;
                list(this.form).then(data => {
                    this.records = data.records;
                    this.total = data.total;
                    this.form.pageSize = data.size;
                }).finally(() => this.loading = false);
            },
            jump(pageNum) {
                this.form.pageNum = pageNum;
                this.list();
            },
            sort(e) {
                this.form.pageNum = 1;
                this.form.orderBy = e.prop;
                this.form.asc = e.order && e.order.indexOf('asc') >= 0;
                this.list();
            }
        }
    }

</script>
