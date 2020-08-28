<template>
    <div>
        <el-table :data="records" border row-key="id" @sort-change="sort" v-loading="loading">
            <el-table-column prop="id" label="ID" sortable="custom"></el-table-column>
            <el-table-column prop="name" label="收入来源" sortable="custom"></el-table-column>
            <el-table-column prop="date" label="收入日期" sortable="custom"></el-table-column>
            <el-table-column prop="paymentSaleType.name" label="科目" sortable="custom"></el-table-column>
            <el-table-column prop="sum" label="收入金额" sortable="custom" align="right"></el-table-column>
            <el-table-column prop="sumAdjust" label="坏账损失" sortable="custom" align="right"></el-table-column>
            <el-table-column prop="sumReceipt" label="发票金额" sortable="custom" align="right"></el-table-column>
            <el-table-column prop="sumApply" label="申请金额" sortable="custom" align="right"></el-table-column>
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
    import {list} from "@/configs/axios/api/paymentSale";
    import {silentLogin} from "@/configs/axios/api/user";

    export default {
        mounted() {
            silentLogin(this.$route.params.agencyId).then(() => {
                this.list();
            });
        },
        data() {
            return {
                loading: false,
                total: 0,
                records: [],
                form: {}
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
                this.form.order = e.order && e.order.indexOf('asc') >= 0;
                this.list();
            }
        }
    }
</script>
