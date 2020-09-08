<template>
    <main>
        <div class="part_header">
        <span class="headerImg">
          <img src="../../../assets/images/wc_logo.png" alt />
        </span>
        </div>
        <div class="part_title">
            <img src="../../../assets/images/titleName.png" alt />
        </div>
        <nav-tab></nav-tab>
        <router-view />
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
    .headerImg {
        width: 1.5rem;
        display: inline-block;
    }
    .headerImg > img {
        max-width: 100%;
        height: auto;
    }
    .part_title {
        width: 10rem;
        margin: 0 auto;
        margin: 0.5rem auto;
    }
    .part_title > img {
        max-width: 100%;
    }
</style>