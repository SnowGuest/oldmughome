
<template>
    <div class="card downloadApp" >
        <img class="downloadApp-icon" src="@/assets/image/logo.png" alt="applogo">
        <div>
            <h3 class="downloadApp-title">MUGHome安卓APP</h3>
            <p class="downloadApp-subTitle">敬请期待</p>
        </div>
        <span class="downloadApp-qrcode">敬请期待</span>
    </div>
</template>

<script lang="ts" setup>
</script>
<style lang="scss" scoped>
.downloadApp {
    display: flex;
    align-items: center;

    &-icon {
        object-fit: cover;
        width: 40px;
        margin-right: 14px;
    }

    &-qrcode {
        margin-left: auto;
    }

    &-title {
        margin-bottom: 2px;
        font-size: 16px;
        margin-bottom: 0px;
    }

    &-subTitle {
        color: var(--mug-sub-text);
    }
}
</style>
