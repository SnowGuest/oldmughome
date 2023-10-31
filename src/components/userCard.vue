<template>
    <template v-if="user">
        <n-avatar v-if="user?.avatarUrl" round lazy :size="size" :src="user?.avatarUrl">
        </n-avatar>
        <div v-else :style="{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: ` ${user?.color} `
        }" class="userHeader">
            {{ user?.nickName[0] }}
        </div>
    </template>
</template>

<script lang="ts" setup>
import { User } from '@/api/user';

interface Props {
    user: User | undefined;
    size: number;
}
defineProps<Props>()
</script>
<style lang="scss" scoped>
.userHeader {
    height: 62px;
    width: 62px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
}
</style>