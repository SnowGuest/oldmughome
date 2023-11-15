<template>
    <n-modal v-model:show="showModal" transform-origin="center">
        <div class="modealBody flex ">
            <box-icon name='x' class="closeIcon" @click="showModal = false"></box-icon>
            <n-form ref="formRef" :model="formValue" :rules="rules" class="modelForm flex column justify-center">
                <h2 class="text-center">登录MUGHome</h2>
                <n-form-item path="account">
                    <n-input class="inputCom" :disabled="loading" v-model:value="formValue.account"
                        placeholder="请输入账号或邮箱" />
                </n-form-item>
                <n-form-item path="password">
                    <n-input class="inputCom" :disabled="loading" v-model:value="formValue.password" placeholder="输入密码" />
                </n-form-item>
                <n-checkbox v-model:checked="formValue.isRemember">
                    记住我
                </n-checkbox>
                <n-form-item>
                    <n-button :loading="loading" block type="primary" attr-type="button" class="submitBtn" @click="submit">
                        登录
                    </n-button>
                </n-form-item>
                <div class="flex justify-between footer">
                    <RouterLink target="_blank" to="">忘记密码?</RouterLink>
                    <RouterLink target="_blank" to="/register">注册新账户</RouterLink>
                </div>
            </n-form>
        </div>
    </n-modal>
</template>

<script lang="ts" setup>
import { login } from '@/api/user';
import { useUserStore } from '@/stores/user';
import { FormInst, FormRules, useMessage } from 'naive-ui';
import { storeToRefs } from 'pinia';
import { reactive, ref } from 'vue';

export interface LoginRef {
    show: () => void
}
const loading = ref(false)
const formValue = reactive({
    account: "",
    password: "",
    isRemember: false,
})
const rules: FormRules = {
    account: [{ required: true, message: '请填写用户名/邮箱' }],
    password: [{ required: true, message: '请填写密码' }]
};
const formRef = ref<FormInst>()
const showModal = ref(false)
defineExpose<LoginRef>({
    show() {
        showModal.value = true
    },
})
const store = useUserStore();
const message = useMessage()
async function submit() {
    if (!formRef.value) return;
    await formRef.value.validate();
    loading.value = true
    try {


        const { data } = await login({ ...formValue })
        store.setLogged(data);
        message.success('登录成功');
        location.reload()
    } finally {
        loading.value = false
    }
}
</script>
<style lang="scss" scoped>
@media screen and (max-width: 768px) {

    .modelForm {
        flex: 1;
    }
}

.modealBody {
    position: relative;
    width: 768px;
    height: 450px;
    max-height: 50vh;
    max-width: 90vw;
    background-color: #fff;
    background: url("@/assets/image/cool-background.png") no-repeat;
    background-size: 100% 100%;
    border-radius: 16px;
    overflow: hidden;

    .modelImage {
        flex: 1;
    }

    .inputCom {
        width: 100%;
    }

    .submitBtn {
        height: 40px;
    }

    .modelForm {
        width: 50%;
        margin-left: auto;
        background-color: #FFF;
        padding: 0 32px;
    }

    .closeIcon {
        position: absolute;
        right: 16px;
        top: 16px;
        cursor: pointer;

        &::after {
            content: "";
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 150%;
            height: 150%;
        }
    }
}
.footer{
    color: rgb(161, 161, 161);
    font-size: 15px;
}
</style>
