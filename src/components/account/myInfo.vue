<!--  -->
<template>
    <div class="card">
        <h3 class="toptip">我的信息</h3>
        <n-divider />
        <n-form ref="formRef" :model="info" :rules="rules" class="modelForm flex column justify-center">
            <h2 class="text-center">登录MUGHome</h2>
            <n-form-item path="account">
                <n-input disabled v-model:value="info.name" placeholder="请输入用户名" />
            </n-form-item>
            <n-form-item path="account">
                <n-input :disabled="loading" v-model:value="info.nickName" placeholder="请填写昵称" maxlength="24" />
            </n-form-item>
            <n-form-item path="account">
                <n-input :disabled="loading" type="textarea" v-model:value="info.bio" placeholder="请填写签名" />
            </n-form-item>
            <n-button type="primary" attr-type="button" class="submitBtn" :loading="loading" @click="sendUserInfo">
                确认修改
            </n-button>
        </n-form>

        <!-- <Form @submit="sendUserInfo" :disabled="loading">
            <Field disabled v-model="info.name" name="用户名" label="用户名" placeholder="请填写用户名" />
            <Field v-model="info.nickName" name="昵称" label="昵称" placeholder="请填写昵称" maxlength="24"
                :rules="rules.nickName" />
            <Field type="textarea" rows="3" v-model="info.bio" name="我的签名" label="我的签名" placeholder="请填写签名"
                :rules="rules.bio" text />
            <div class="center">
                <Button type="primary" native-type="submit" class="submitBtn" :loading="loading">
                    确认修改
                </Button>
            </div>
        </Form> -->
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
// import { Divider, Form, Field, Button, type FieldRule, showFailToast, showSuccessToast } from "vant";
import { updateUserInfo, User } from "@/api/user";
import { useUserStore } from "@/stores/user";
import { reactive, ref } from "vue";
import { FormInst, FormRules, useMessage } from "naive-ui";
interface Props {
    self: boolean
}
const formRef = ref<FormInst>()
const rules: FormRules = {
    nickName: [{ required: true, message: '请填写昵称' }, {
        max: 18,
        message: "昵称长度应小于18个字符",
    }],
    bio: [{ required: true, message: '请填写签名' }]
}
defineProps<Props>()
const info = reactive<User>({
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
    email: "",
    postCount: "0",
    followerCount: "0"
});
const loading = ref(false)
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore)
const message = useMessage()
Object.assign(info, JSON.parse(JSON.stringify(userInfo.value)));
async function sendUserInfo() {
    try {
        await formRef.value?.validate()
        loading.value = true;
        const id = info.id
        if (!Boolean(id)) throw new Error("系统错误，请刷新页面");
        const { data, code } = await updateUserInfo(id, {
            bio: info.bio,
            nickName: info.nickName
        })
        if (code === 0) { userStore.setLogged(data); message.success("修改成功"); }

    } catch (error) {
        if (error instanceof Error) {
            message.error(error.message)
        }
    } finally {
        loading.value = false
    }
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
</style>
