
<template>
    <div class="check align-center card between">
        <span>开发中，请耐心等待</span>
        <button class="check-button">签到</button>
    </div>
</template>

<script lang="ts" setup>
</script>
<style lang="scss" scoped>
.check {
    >span {
        font-size: 18px;
        color: #999999;
    }

    &-button {
        background-image: linear-gradient(135deg, #CE9FFC 10%, #7367F0 100%);
        border-radius: 16px;
        border: none;
        color: #FFFFFF;
        padding: 6px 18px;
    }
}
</style>
