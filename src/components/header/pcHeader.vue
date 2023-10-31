<template>
    <header class="mug_pc-header">
        <nav class="flex items-center justify-center  pr-3 mr-3 mug_pc-logoBody">
            <img class="logo" src="@/assets/image/logo.png" alt="">
            <img class="logoText" src="@/assets/image/logoText.png" alt="">
        </nav>
        <n-tabs :value="checkValue">
            <n-tab v-for="(e, i) in menus" :key="e" :name="e">
                <RouterLink :to="e" class="mug_pc-header-menu" :class="{ 'mug_pc-header-menu-check': checkValue === e }">{{
                    $t(`component.header.menu[${i}]`) }}</RouterLink>
            </n-tab>
        </n-tabs>
        <i18n />
        <search />
        <avatar userMode="header" />
    </header>
</template>

<script lang="ts" setup>
import avatar from "../user/avatar.vue";
import search from "./search.vue";
import i18n from "./i18n.vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
// import { provide, ref } from "vue";
// import { DIRECTION } from "@/utils";
let checkValue = computed(e=>{
    return route.path
}) 
const menus = ["/", "/categories", "/monf/2023", "/bof/2023"]

</script>
<style lang="scss" scoped>
@media only screen and (min-width: 768px) {
    .mug_pc-header {
        display: flex !important;
    }
}

.mug_pc {
    &-logoBody {
        // height: 100%;
        border-right: 1px solid #efefef;
    }
}

.mug_pc-header-hide {
    transform: translateY(-100%);
}

.mug_pc-header {
    display: none;
    max-width: 1200px;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    align-items: center;
    background: url("@/assets/image/headerGround.webp") no-repeat 50%/1400px;
    transform: all 0.31s;

    &-menu {
        // height: 100%;
        font-size: 18px;
        font-weight: 400;
    }

    &-menu-check {
        font-weight: 600 !important;
    }


    .logo {
        object-fit: cover;
        height: 30px;
        margin-right: 12px;
    }

    .logoText {
        object-fit: cover;
        height: 20px;
    }
}
</style>