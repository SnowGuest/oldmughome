<template>
    <nav class="ml-3 mr-3">
        <n-avatar v-if="logged.login" round size="small" :src="userInfo?.avatarUrl" />
        <n-button v-else type="info">登录</n-button>
    </nav>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import type { User } from '@/api/user';
import { useUserStore } from '@/stores/user';
const store = useUserStore()
const { logged, userInfo } = storeToRefs(store);
interface Props {
    userMode: User | "header"
}
defineProps<Props>()
</script>
<style lang="scss" scoped></style>