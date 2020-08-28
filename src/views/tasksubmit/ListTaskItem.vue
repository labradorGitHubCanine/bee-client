<template>
    <div>
        <el-card>
            <el-page-header @back="this.$back" content="其它填报项设置" style="margin-bottom: 10px"></el-page-header>
            <el-form :inline="true">
                <el-form-item>
                    <el-input v-model="form.name" placeholder="查询名称" @input="list()" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button icon="el-icon-refresh" @click="list(true)">重 置</el-button>
                    <el-button icon="el-icon-plus" type="primary" @click="create()">创 建</el-button>
                </el-form-item>
            </el-form>
            <el-table
                    ref="table"
                    :data="records"
                    border
                    stripe
                    highlight-current-row
                    v-loading="loading"
            >
                <el-table-column prop="name" label="名称"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="modify(scope.row.id, scope.row.name)">修改</el-button>
                        <el-button type="text" @click="drop(scope.row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
    import {create, drop, list, modify} from "@/configs/axios/api/taskItem";

    export default {
        mounted() {
            this.list();
        },
        data() {
            return {
                form: {},
                loading: false,
                records: []
            }
        },
        methods: {
            list(reset) {
                if (reset) {
                    this.form = {};
                    this.$refs.table.clearSort();
                }
                list(this.form).then(data => {
                    this.records = data.records;
                }).finally(() => this.loading = false);
            },
            create() {
                this.$prompt(null, '填写名称').then(({value}) => {
                    create({name: value}).then(() => this.list(true));
                });
            },
            modify(id, name) {
                this.$prompt(null, '填写名称', {inputValue: name}).then(({value}) => {
                    modify({id: id, name: value}).then(() => this.list());
                });
            },
            drop(id) {
                this.$confirm(null, '确认删除？').then(() => {
                    drop(id).then(() => this.list());
                });

            }
        }
    }
</script>