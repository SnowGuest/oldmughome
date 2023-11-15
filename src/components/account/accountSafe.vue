<!--  -->
<template>
    <div class="card">
        <h3 class="toptip">账户安全</h3>
        <n-divider />
        <!-- <Form :disabled="loading">
            <Field readonly v-model="info.email" name="邮箱" label="邮箱">
                <template #button>
                    <span class="linkText" @click="updateEmailShow = true">修改邮箱</span>
                </template>
            </Field>
            <Field readonly v-model="passwordLabel" name="密码" label="密码">
                <template #button>
                    <span class="linkText" @click="toUpdatePassword">修改密码</span>
                </template>
            </Field>

        </Form> -->
    </div>
    <n-modal v-model:show="updateEmailShow">
        <div class="forget_box">
            <h4 class="foget_title">重置邮箱</h4>
            <n-form-item path="account" ref="formItemRef">
                <n-input disabled v-model:value="email" placeholder="请输入新邮箱" />
            </n-form-item>

            <n-button type="primary" attr-type="button" class="submitBtn" :loading="updateEmailLoading"
                @click="onForgetPass">
                确认修改
            </n-button>
            <!-- <Form class="Forms" ref="formInstater" @submit="onForgetPass" :disabled="updateEmailLoading">
                <myFieldVue enterkeyhint="send" autocomplet="forgetAccount" placeholder="请输入新邮箱" icon="clarity:email-line"
                    label="邮箱" :loading="updateEmailLoading" name="email" :rule="rules.email" v-model:model-value="email">
                    <template #right>
                        <div class="flex foget_right">
                            <Button :loading="updateEmailLoading" native-type="submit" round class="ForgetBtn"
                                type="primary">
                                <Icon color="#FFF" name="ic:outline-keyboard-arrow-right" size="34"></Icon>
                            </Button>
                        </div>
                    </template>
                </myFieldVue>
            </Form> -->
            <p class="forget_text"><span style="color:red;">*</span> 我们会将一封验证邮件发送到你的新邮箱内,请耐心等待。</p>
        </div>
    </n-modal>
</template>

<script lang="tsx" setup>
// import myFieldVue from "@/components/authorize/myField.vue";
import { sendResetEmail } from "@/api/reset";
import { FormItemInst, FormRules, useDialog, useMessage, useNotification } from "naive-ui";
import { storeToRefs } from "pinia";
// import { Popup, Divider, Form, Field, Button, type FieldRule, showFailToast, showSuccessToast } from "vant";
import { updateUserInfo, User } from "@/api/user";
import { useUserStore } from "@/stores/user";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
const formItemRef = ref<FormItemInst>()
interface Props {
    self: boolean
}

const passwordLabel = ref("********************")
const updateEmailShow = ref(false);
const updateEmailLoading = ref(false)
const rules: FormRules = {
    nickName: [{ required: true, message: '请填写昵称' }, {
        max: 18,
        message: "昵称长度应小于18个字符"
    }],
    bio: [{ required: true, message: '请填写签名' }],
    email: [{ required: true, message: '请填写邮箱' }, {
        trigger: "onChange",
        message: "请输入正确的邮箱格式",
        validator: (v) => /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(info.email) ? new Error("请输入正确的邮箱格式") : undefined
    }],
}
defineProps<Props>()
const info = reactive<Record<string, any>>({
    id: -1,
    name: "",
    nickName: "",
    role: -1,
    createdDate: "",
    avatarUrl: "",
    points: "",
    continuousPunchCount: "",
    bio: "",
    userCoverUrl: undefined,
    email: ""
});
const loading = ref(false)
const notification = useNotification()
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore)
Object.assign(info, JSON.parse(JSON.stringify(userInfo.value)));
const email = ref<string>("");
async function onForgetPass() {
    try {
        await formItemRef.value?.validate()
        if (updateEmailShow.value && !updateEmailLoading.value) {
            updateEmailLoading.value = true
            const { code } = await sendResetEmail(email.value)
            if (code === 0) {
                email.value = ""
                updateEmailShow.value = false
                notification.success({ title: "成功", content: "邮件发送成功，请注意查收" });
                updateEmailLoading.value = false
            }
        }
    } finally {
        updateEmailLoading.value = false
    }

}
const router = useRouter()
function toUpdatePassword() {
    window.open(router.resolve({
        path: `/reset/password`
    }).href, "_blank")

}

</script>
<style lang="scss" scoped>
.card {
    background-color: var(--mug-card-bg);
    border-radius: 8px;
    padding-top: 14px;
    min-height: 70vh;

    .toptip {
        padding: 0 24px;
    }
}

.submitBtn {
    height: 36px;
    width: 260px;
    margin: 24px auto;
    max-width: 80vw;
}

.linkText {
    color: #1677ff;
    transition: all 0.21s;
    cursor: pointer;
    user-select: none;

    &:hover {
        color: #69b1ff;
    }

    &:active {
        color: #0958D9;
    }
}

.foget_right {
    height: 100%;
    align-items: center;
    background-color: #FFFFFF;
    padding: 0 16px;
}

.forget_box {
    border-radius: 8px;
    overflow: hidden;
    padding: 20px;
    max-width: calc(100vw - 16px);

    .foget_title {
        font-weight: 500;
        font-size: 20px;
        margin-bottom: 24px;
    }



    .forget_text {
        max-width: 90vw;
        width: 300px;
        padding: 0 14px;
        font-size: 12px;
        margin-top: 20px;
        line-height: 18px;
    }

    .Forms {
        border: 1px solid var(--mug-dividing);
        border-radius: 8px;
        overflow: hidden;

        :deep(.van-cell) {
            padding: 0px !important;
        }
    }
}

.forget_text {
    max-width: 90vw;
    width: 300px;
    padding: 0 14px;
    font-size: 12px;
    margin-top: 20px;
    line-height: 18px;
}

.ForgetBtn {
    width: 40px;
    height: 40px;
}
</style>
