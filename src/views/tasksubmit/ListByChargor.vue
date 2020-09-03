<template>
    <div>
        <el-card>
            <el-page-header @back="this.$back" :content="`${form.year}年 负责人任务额汇总`" style="margin-bottom: 10px"></el-page-header>
            <el-form inline>
                <el-form-item>
                    <el-input v-model="form['name']" placeholder="查询姓名" clearable @input="list()"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-refresh" @click="list(true)">重 置</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    ref="table"
                    :data="records"
                    border stripe
                    highlight-current-row
                    v-loading="loading"
                    @sort-change="sort"
            >
                <el-table-column prop="name" label="姓名" sortable="custom"></el-table-column>
                <el-table-column prop="sum0" :label="`${form.year}年销售额`" sortable="custom" align="right"></el-table-column>
                <el-table-column prop="sum1" :label="`${form.year-1}年销售额`" sortable="custom" align="right"></el-table-column>
                <el-table-column prop="sum2" label="近12个月销售额" sortable="custom" align="right"></el-table-column>
                <el-table-column prop="sum3" label="近3个月销售额" sortable="custom" align="right"></el-table-column>
                <el-table-column prop="target" :label="`${form.year+1}年总目标销售额`" sortable="custom" align="right"></el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
    import {listByChargor} from "@/configs/axios/api/taskCustomerByDj";

    export default {
        mounted() {
            this.list();
        },
        data() {
            return {
                loading: false,
                form: {year: this.$route.params.year},
                records: []
            }
        },
        methods: {
            list(reset) {
                if (reset) {
                    this.$refs.table.clearSort();
                    this.form = {year: this.$route.params.year};
                }
                this.loading = true;
                listByChargor(this.form)
                    .then(data => this.records = data.records)
                    .finally(() => this.loading = false);
            },
            sort(e) {
                this.form.orderBy = e.prop;
                this.form.asc = e.order && e.order.indexOf('asc') >= 0;
                this.form.pageNum = 1;
                this.list();
            },
        }
    }
</script>