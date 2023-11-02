<template>
    <nav class="ml-3 mr-3" style="cursor: pointer;">
        <n-avatar v-if="logged.login" round size="large" :src="userInfo?.avatarUrl" />
        <n-button v-else type="info" @click="header?.login">登录</n-button>
    </nav>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import type { User } from '@/api/user';
import { useUserStore } from '@/stores/user';
import { inject } from "vue";
import type { HeaderInject } from "@/components/header/useHeader.vue"
const store = useUserStore()
const { logged, userInfo } = storeToRefs(store);
interface Props {
    userMode: User | "header"
}
defineProps<Props>()
const header = inject<HeaderInject>("header");

</script>
<style lang="scss" scoped></style>