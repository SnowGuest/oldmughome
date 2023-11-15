
<template>
    <div class="bg center">
        <RouterView />
    </div>
</template>

<script lang="ts" setup>
import { RouterView } from "vue-router"
</script>
<style lang="scss" scoped>
.bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: url("@/assets/image/bg.jpg");
    background-repeat: no-repeat;
    background-size: cover;
}
</style>