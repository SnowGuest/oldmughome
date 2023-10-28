<template>
    <div class="mug-header">{{ $t("component.header.frontPage") }}</div>
    <div @click="() => {
        app?.setLocale('en-us')
    }">点击切换</div>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import type { App } from "@/App.vue"
const app = inject<App>("app");
</script>
<style lang="scss" scoped>
.mug-header {
    background-color: #fff;
    box-shadow: 0 5px 40px #113a5d1a;
    box-sizing: border-box;
    display: flex;
    height: 70px;
    justify-content: center;
    padding: 0 20px;
    transition: all .3s ease-in-out;
    width: 100%;
}
</style>