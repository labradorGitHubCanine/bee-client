<template>
    <div>
        <template v-if="urls().length > 0">
            <el-image v-for="(i, j) in urls()" :key="j" :src="i" style="width: 100%"></el-image>
        </template>
        <template v-else>
            <div style="color: white">{{detail.intro}}</div>
        </template>
    </div>
</template>
<script>
    import {silentLogin} from '@/configs/axios/api/user'
    import {detail} from "@/configs/axios/api/agency"

    export default {
        mounted() {
            silentLogin(this.$route.params.agencyId).then(() => {
                detail(0).then(data => {
                    this.detail = data
                    console.log(JSON.stringify(data, null, 4));
                });
            });
        },
        data() {
            return {
                detail: {introImg: ''}
            }
        },
        methods: {
            urls() {
                return this.detail.introImg.split(',').filter(e => !!e);
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
