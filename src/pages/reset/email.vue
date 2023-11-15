<template>
    <div class="card" v-if="codes === 200 && !errorFlag">
        您已经成功重置邮箱,请登录你的新账号
    </div>
</template>

<script lang="ts" setup>
import { checkMd5, resetEmailLocal } from '@/api/reset';
import { useHead } from '@unhead/vue';
import { error } from 'console';
import { useMessage } from 'naive-ui';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const errorFlag = ref(false)
const message = useMessage();
const codes = ref(200);
try {
    if (!("md5" in route.query)) throw new Error("404");
    if (!("t" in route.query)) throw new Error("404");
    const { md5, t } = route.query as Record<string, string>;

    async function preload() {
        const { code } = await checkMd5(md5, t, "email");
        if (code == 150) {
            errorFlag.value = true;
            message.error("此链接已过期,请重新申诉", {
                duration: 10000,
            })
        } else {
            const { code } = await resetEmailLocal(md5);
            if (code !== 200) {
                codes.value = code || 200
            }
        }
    }
    preload()

    useHead({
        title: "重置邮箱 - MUGHome"
    })
} catch (error) {
    router.replace({
        path: "/home"
    })
}
</script>
<style lang="scss" scoped></style>