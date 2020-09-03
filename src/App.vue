<template>
    <div>
        <router-view/>
    </div>
</template>
<script>
    export default {
        mounted() {
        }
    }
</script>
<style>
    * {
        font-family: "Microsoft YaHei", serif;
    }

    /**:not(.is-circle):not(.el-timeline-item__node) {*/
    /*    border-radius: 1px !important;*/
    /*}*/

    html, body {
        margin: 0;
        padding: 0;
        height: 100vh;
    }
</style>
