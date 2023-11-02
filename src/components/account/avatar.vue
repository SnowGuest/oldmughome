
<template>
    <div class="card column">
        <h3 class="toptip">我的头像</h3>
        <n-divider />
        <div class="userAatar center column">
            <div class="avatar">
                <n-image v-if="userInfo?.avatarUrl" width="140" height="140" radius="50%"
                    :src="userInfo?.avatarUrl"></n-image>
                <div class="avatarHover center" @click="chooseImage">
                    <Icon name="ic:baseline-camera-alt" color="#FFFFFF" size="38"></Icon>
                </div>
            </div>
            <span class="nickName"> {{ userInfo?.nickName }}</span>
        </div>
        <!-- <Divider /> -->
        <!-- <Tabs v-model:active="active" shrink>
            <Tab title="头像框" title-class="TabTitle">
                <List :immediate-check="false" v-model:loading="listLoad" :finished="listFinished" finished-text="没有更多了"
                    @load="onLoadList">
                    <ul class="List">
                       <ArticleVue v-for="item in comments" :key="item" user="" article="" /> 
                    </ul>
                    <template #finished>
                        <Empty description="没有更多了"></Empty>
                    </template>
                </List>
            </Tab>
        </Tabs> -->
    </div>
</template>

<script lang="ts" setup>
import { storeToRefs } from "pinia";
// import { Divider, Uploader, Empty, List, type UploaderFileListItem, Image, Tabs, Tab, showSuccessToast } from "vant";
// import { uploaderFile } from "@/api/file";
import { uploaderUserAvatar } from "@/api/user";
import { useUserStore } from "@/stores/user";
import { ref, watch } from "vue";
import { useFileDialog } from "@vueuse/core"
import { useMessage } from "naive-ui";
interface Props {
    self: boolean
}
defineProps<Props>()
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);


const active = ref(0);
const listLoad = ref(false);
const listFinished = ref(true);
const list = ref([]);
const { files, open, reset } = useFileDialog({
    accept: "image/*",
    multiple: false
})
function onLoadList() {

}
function chooseImage() {
    open()
    const stop = watch(files, () => {
        const file = files.value?.item(0)
        if (file) {
            stop();
            reset();
            uploadFile(file)
        }
    })
}
const message = useMessage()
async function uploadFile(file: File) {
    if (!userInfo.value) return;
    const { data, code } = await uploaderUserAvatar(userInfo.value.id, file);
    if (data && code === 0) {
        userStore.setLogged(data)
        message.success("上传成功")
    }

}
</script>
<style lang="scss" scoped>
.card {
    background-color: var(--mug-card-bg);
    border-radius: 8px;
    padding-top: 14px;
    min-height: 70vh;

    :deep(.TabTitle) {
        font-size: 18px;
        font-weight: 500;
    }

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

.userAatar {
    height: 30vh;
    max-height: 500px;
    min-height: 280px;
    --van-padding-xs: 0px;
    --van-uploader-icon-size: 34px;
    --van-uploader-size: 140px;

    :deep(.van-uploader) {
        border-radius: 50%;
        overflow: hidden;
    }

    // --van-uploader-upload-background: transparent;
}

.avatar {
    height: 140px;
    width: 140px;
    border: 1px solid var(--mug-dividing);
    border-radius: 50%;
    cursor: pointer;
    position: relative;

    &:hover {
        .avatarHover {
            opacity: 1 !important;
            pointer-events: all !important;
        }
    }

    .avatarHover {

        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        opacity: 0;
        pointer-events: none;
        background-color: rgba(0, 0, 0, 0.55);
        transition: 0.21s all;


    }
}

.nickName {
    font-size: 18px;
    margin-top: 12px;
    position: relative;
}
</style>
