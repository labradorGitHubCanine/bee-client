<template>
    <div>
        <el-card class="card">
            <el-form>
                <h2>欢迎登录</h2>
                <el-form-item>
                    <el-input v-model="form['username']" prefix-icon="el-icon-user" placeholder="请使用东角账号登录" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="form['password']" prefix-icon="el-icon-key" placeholder="请输入密码" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button style="width: 100%" type="primary" @click="login">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
    import {login} from "@/configs/axios/api/user";

    export default {
        data() {
            return {
                form: {
                    username: 'djshouyi',
                    password: '811105',
                },
                data1: {}
            }
        },
        methods: {
            login() {
                login(this.form).then(() => {
                    this.$router.push({name: 'tasksubmit-listByCustomer'});
                });
            }
        }
    }
</script>

<style scoped>
    .card {
        width: 25rem;
        margin: 5rem auto;
    }
</style>