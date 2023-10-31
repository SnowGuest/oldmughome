<template>
    <footer class="sidebar-footer">
        <RouterLink to="/privacyPolicy" target="_blank" rel="bookmark"><span>社区隐私政策</span></RouterLink>
        <span>&nbsp;|&nbsp;</span>
        <RouterLink to="/userProtocol" target="_blank" rel="bookmark"> <span>用户协议</span></RouterLink>
    </footer>
</template>

<script lang="ts" setup>
</script>
<style lang="scss" scoped>
.sidebar-footer {
    font-size: 12px;

    span {
        color: var(--mug-sub-text);

        &:hover {
            color: var(--mug-text);

        }
    }
}
</style>
