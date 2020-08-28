<template>
    <div>
        <el-image v-for="(i, j) in urls()" :key="j" :src="i" style="width: 100%"></el-image>
    </div>
</template>
<script>
    import {silentLogin} from '@/configs/axios/api/user'
    import {detail} from "@/configs/axios/api/agency";

    export default {
        mounted() {
            silentLogin(this.$route.params.agencyId).then(() => {
                detail(0).then(data => this.detail = data);
            });
        },
        data() {
            return {
                detail: {}
            }
        },
        methods: {
            urls() {
                return this.detail['introImg'].split(',');
            }
        }
    }
</script>
<style scoped>
    .introText {
        line-height: 2;
        background: rgba(0, 0, 0, 0.5);
        padding: 10px;
        color: #68d4e6;
    }
</style>
