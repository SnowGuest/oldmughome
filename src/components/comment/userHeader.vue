<template>
    <NuxtLink target="_blank" :to="`/account/${getUser(item.createdUserId)?.id}`" style="min-width: 50px;">
        <Image round width="50" height="50" :src="getUser(item.createdUserId)?.avatarUrl">
        </Image>
    </NuxtLink>
</template>

<script lang="ts" setup>
</script>
<style lang="scss" scoped></style>