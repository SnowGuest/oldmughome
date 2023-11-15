<template>
    <NuxtLayout>
        <div class="page flex items-center justify-center column">
            <img class="pageImage" src="@/assets/image/error.svg" alt="" />
            <div>加载数据失败~</div>
            <RouterLink replace to="/">
                <n-button>回首页</n-button>
            </RouterLink>
        </div>
    </NuxtLayout>
</template>

<script lang="ts" setup>


</script>
<style lang="scss" scoped>
.page {
    background-color: var(--mug-card-bg);
    color: var(--mug-text);
    width: 50vw;
    height: 80vh;
    margin: auto;

    .pageImage {
        object-fit: cover;
        width: 20%;
    }

    div {
        margin: 50px 0;
        font-size: 22px;
    }
}
</style>
