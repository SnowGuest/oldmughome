
<template>
    <n-form class="Forms" ref="formInstater" @submit="onForgetPass" :disabled="errorFlag" v-if="errorFlag" :rules="rules">
        <h3>请重设您的帐号密码</h3>
        <n-form-item>
            <n-input placeholder="请输入密码" v-model:model-value="resetForm.password" />
        </n-form-item>
        <n-form-item>
            <n-input placeholder="再次输入密码" v-model:model-value="resetForm.currentPassword" />
        </n-form-item>
        <div class="mt-5 mb-5">仅支持数字字母和下划线</div>
        <n-button :loading="forgetLoading" block type="info" @click="onForgetPass" class="mt-3" native-type="submit">
            重设密码
        </n-button>
    </n-form>
</template>

<script lang="ts" setup>
import { checkMd5, resetLoginPassword } from "@/api/reset";
import { FormInst, FormRules, useMessage } from "naive-ui";
import { useUserStore } from "@/stores/user";
import { useHead } from "@unhead/vue";
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const rules: FormRules = {
    password: [{ required: true, message: '请填写密码' },
    {
        message: "密码应在8~16位之间",
        max: 18,
        min: 8
    },
    {
        message: "仅支持数字字母和下划线",
        validator: (_, v) => /^[A-Za-z0-9._~!@#$^&*]{8,16}$/g.test(v) ? new Error("仅仅支持数字字母和下划线") : undefined
    }],
    currentPassword: [{
        required: true,
        message: "请再次输入密码"
    }, {
        trigger: "onChange",
        message: '密码不一致', validator(v) {
            return resetForm.password === v
        }
    }]
}
const errorFlag = ref(false)
const message = useMessage()
const resetForm = reactive({
    password: "",
    currentPassword: ""
})
const formInstater = ref<FormInst>()

const forgetLoading = ref(false);

const store = useUserStore()
async function onForgetPass() {
    try {

        if (!forgetLoading.value) {
            await formInstater.value?.validate()
            forgetLoading.value = true
            const { code } = await resetLoginPassword(resetForm.password, `${store.userInfo?.id}`)
            if (code === 0) {
                resetForm.password = ""
                resetForm.currentPassword = ""
                message.success("修改密码成功!");
                store.resetLogged()
                setTimeout(() => {
                    router.replace({
                        path: "/",
                        replace: true
                    })
                }, 800)
                forgetLoading.value = false
            }
        }
    } finally {
        forgetLoading.value = false
    }
}
useHead({
    title: "重置密码 - MUGHome"
})
</script>
<style lang="scss" scoped>
.Forms {
    background-color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20%;
}
</style>