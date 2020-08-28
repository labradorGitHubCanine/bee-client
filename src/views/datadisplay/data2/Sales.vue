<template>
    <div class="salesTab">
        <el-tabs @tab-click="tabChange" v-model="form.tab">
            <el-tab-pane label="本月" name="1"></el-tab-pane>
            <el-tab-pane label="本季度" name="2"></el-tab-pane>
            <el-tab-pane label="半年度" name="3"></el-tab-pane>
            <el-tab-pane label="年度" name="4"></el-tab-pane>
        </el-tabs>
        <el-table :data="records" border  row-key="id" v-loading="loading">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="extra.orderSum" label="销售额" sortable :sort-method="(a,b)=>+a.extra['orderSum'] - +b.extra['orderSum']" align="right"></el-table-column>
            <el-table-column prop="" label="待回款" sortable></el-table-column>
            <el-table-column prop="" label="已回款" sortable></el-table-column>
        </el-table>
    </div>
</template>
<script>
    import {form, silentLogin} from "@/configs/axios/api/user";

    export default {
        mounted() {
            silentLogin(this.$route.params.agencyId).then(() => {
                this.list();
            });
        },
        data() {
            return {
                loading: false,
                records: [],
                form: {
                    tab: '1'
                }
            }
        },
        methods: {
            list() {
                this.loading = true;
                form(this.form).then(data => {
                    this.records = data.records;
                }).finally(() => this.loading = false);
            },
            jump(pageNum) {
                this.form.pageNum = pageNum;
                this.list();
            },
            tabChange(e) {
                this.form.tab = e.name;
                this.list();
            }
        }
    }
</script>
