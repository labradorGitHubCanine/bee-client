<template>
    <div>
        <i class="el-icon-top" v-if="up"></i>
        <i class="el-icon-bottom" v-else></i>
        {{value}}%
    </div>
</template>
<script>
    export default {
        mounted() {

        },
        props: {
            nval: {
                type: Number,
                require: true
            },
            oval: {
                type: Number,
                require: true
            }
        },
        computed: {
            value() {
                if (this.oval === 0)
                    return '∞';
                else
                    return ((this.nval / this.oval - 1) * 100).toFixed(1);
            },
            up() {
                if (this.oval === 0)
                    return true;
                else
                    return this.nval >= this.oval;
            }
        }
    }
</script>