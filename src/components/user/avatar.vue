<template>
    <nav class="ml-3 mr-3" style="cursor: pointer;" v-if="userMode === 'header'">
        <n-popover trigger="click" v-if="logged.login">
            <template #trigger>
                <n-avatar round size="large" :src="userInfo?.avatarUrl" />
            </template>
            <div></div>
            <div class="p-2">
                <RouterLink :to="`/account/${userInfo?.id}`" class="flex items-center cursor-pointer" title="个人中心">
                    <n-avatar class="mr-2" round size="large" :src="userInfo?.avatarUrl" />
                    <div class="flex-1 flex flex-col">
                        <span text class="text-4">{{ userInfo?.nickName }}</span>
                        <span class="text-3">积分：{{ userInfo?.points }}</span>
                    </div>
                </RouterLink>
                <n-divider />
                <div class="grid grid-cols-2">
                    <n-button quaternary>
                        <RouterLink to="/creator">写文章</RouterLink>
                    </n-button>
                </div>
                <n-divider />
                <div class="flex items-center justify-between">
                    <n-button text @click="loginOut">退出登录</n-button>
                </div>
            </div>
        </n-popover>

        <n-button v-else type="info" @click="header?.login">登录</n-button>
    </nav>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia"
import type { User } from '@/api/user';
import { useUserStore } from '@/stores/user';
import { inject } from "vue";
import type { HeaderInject } from "@/components/header/useHeader.vue"
import { useDialog } from "naive-ui";
const store = useUserStore()
const { logged, userInfo } = storeToRefs(store);
interface Props {
    userMode: User | "header"
}
defineProps<Props>()
const header = inject<HeaderInject>("header");
const dialog = useDialog()
function loginOut() {
    dialog.warning({
        title: '退出登录',
        content: '你确定要退出登录吗？',
        positiveText: '确定',
        negativeText: '点错了',
        onPositiveClick: () => {
            store.resetLogged();
            setTimeout(() => {
                location.href = "/"
            }, 500)
        },
    })
}
</script>
<style lang="scss" scoped></style>