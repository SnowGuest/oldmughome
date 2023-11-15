
<template>
    <n-form class="Forms" ref="formInstater" :disabled="errorFlag" v-if="errorFlag" :rules="rules">
        <h3>请重设您的帐号密码</h3>
        <n-form-item>
            <n-input placeholder="请输入密码" v-model:model-value="resetForm.password" />
        </n-form-item>
        <n-form-item>
            <n-input placeholder="再次输入密码" v-model:model-value="resetForm.currentPassword" />
        </n-form-item>
        <div class="mt-5 mb-5">仅支持数字字母和下划线</div>
        <n-button :loading="forgetLoading" block type="info" class="mt-3" attr-type="button" @click="onForgetPass">
            重设密码
        </n-button>
    </n-form>
</template>

<script lang="ts" setup>
import { checkMd5, resetPassword } from "@/api/reset";
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
        message: '密码不一致', validator(_, v) {
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
const store = useUserStore();

const forgetLoading = ref(false);
let md5: string = ""
let t: string = ""
try {
    if (!("md5" in route.query)) throw new Error("404");
    if (!("t" in route.query)) throw new Error("404");
    md5 = route.query.md5 as string;
    t = route.query.t as string
    async function reload() {
        const { code } = await checkMd5(md5, t, "account");
        if (code == 150) {
            errorFlag.value = true;
            message.error("此链接已过期,请重新申诉", {
                duration: 10000,
            })
        }
    }
    reload()

} catch (error) {

}
async function onForgetPass() {
    try {
        if (!forgetLoading.value) {
            await formInstater.value?.validate()
            forgetLoading.value = true

            const { code } = await resetPassword(md5, resetForm.password)
            if (code === 0) {
                resetForm.password = ""
                resetForm.currentPassword = ""
                message.success("重置密码成功,请重新登录!");
                setTimeout(() => {
                    router.replace({
                        path: "/authorize",
                        replace: true
                    })
                }, 1000)
                // store.setLogged(data.value.data)
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