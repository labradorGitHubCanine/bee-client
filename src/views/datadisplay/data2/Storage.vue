<template>
    <div>
        <el-table :data="records" row-key="id" @sort-change="sort" @row-click="rowClick" v-loading="loading">
            <el-table-column prop="id" label="ID" sortable="custom"></el-table-column>
            <el-table-column prop="name" label="库位名称" sortable="custom"></el-table-column>
            <el-table-column prop="storehouseType.name" label="库位类型" sortable="custom"></el-table-column>
            <el-table-column prop="address" label="库位地址" sortable="custom">
                <template slot-scope="scope">
                    {{scope.row['province'].name}}{{scope.row.city.name}}{{scope.row.address}}
                </template>
            </el-table-column>
            <el-table-column prop="batchCount" label="批次数量" sortable="custom"></el-table-column>
            <el-table-column prop="batchChecked" label="已盘点" sortable="custom"></el-table-column>
            <el-table-column prop="batchUnchecked" label="未盘点" sortable="custom">
                <template slot-scope="scope">
                    {{+scope.row['batchCount'] - +scope.row['batchChecked']}}
                </template>
            </el-table-column>
            <el-table-column prop="checkTime" label="最近盘点" sortable="custom">
                <template slot-scope="scope">
                    {{scope.row['checkTime'].concat(' '.repeat(10)).substring(0, 10)}}
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
    import {list} from '@/configs/axios/api/storehouse'
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
                    this.form.pageNum = data.current;
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
            },
            rowClick(row) {
                this.$router.push(this.$route.path + "/" + row.id);
            }
        }
    }

</script>
