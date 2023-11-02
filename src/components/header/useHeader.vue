<template>
    <div class="mug-headerBody">
        <pcHeader />
        <moblieHeader />
        <Login ref="loginRef" />
        <!-- {{ $t("component.header.frontPage") }} -->
    </div>
</template>

<script lang="ts" setup>
import { inject, provide, ref } from 'vue';
import type { App } from "@/App.vue"
const app = inject<App>("app");
import pcHeader from "./pcHeader.vue";
import moblieHeader from "./moblieHeader.vue";
import Login, { type LoginRef } from "./login.vue";
export interface HeaderInject {
    login: () => void;
}
const loginRef = ref<LoginRef>()
provide<HeaderInject>("header", {
    login() {
        loginRef.value?.show()
    }
})
function checklocal() {
    app?.setLocale('en-us')
}
</script>
<style lang="scss" scoped>
.mug-headerBody {
    background-color: #fff;
    box-shadow: 0 5px 40px #113a5d1a;
    height: 70px;
    padding: 0 20px;
    transition: all .3s ease-in-out;
    width: 100%;
    z-index: 10;
}
</style>