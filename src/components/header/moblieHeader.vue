<template>
    <header class="mug_moblie-header">手机</header>
</template>

<script lang="ts" setup>
import { reactive, toRefs, onBeforeMount, onMounted } from 'vue'
</script>
<style lang="scss" scoped>
@media only screen and (max-width: 768px) {
    .mug_moblie-header {
        display: flex !important;
    }
}

.mug_moblie-header {
    display: none;
    max-width: 768px;
    width: 100%;
    margin: 0 auto;
}
</style>