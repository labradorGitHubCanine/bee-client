<template>
    <main>
        <nav-tab></nav-tab>
    </main>
</template>
<script>
    import NavTab from "@/views/datadisplay/data1/NavTab";
    export default {
        components:{NavTab},
        data() {
            return {
                storehouseId: this.$route.params.storehouseId
            }
        }
    }
</script>
<style scoped>
    main {
        width: 100%;
        height: 100vh;
        background-image: url(../../../assets/images/data1Bg.jpg);
        background-size: 100% 100%;
        background-repeat: no-repeat;
        background-position: center center;
        background-attachment: fixed;
    }
</style>