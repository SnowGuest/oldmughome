
<template>
    <ScrollView>
        <div class="creator">
            <div class="card column">
                <input v-model="form.title" type="text" class="titleInput" placeholder="标题">
                <MdEditor ref="editorRef" @on-upload-img="onUploadImg" :toolbars="toolbar" class="Editor"
                    v-model="form.content">
                    <template #defToolbars>
                        <NormalToolbar title="Bilibili" @onClick="addBilibili">
                            <template #trigger>
                                <Icon name="ri:bilibili-line"></Icon>
                            </template>
                        </NormalToolbar>
                    </template>

                </MdEditor>
                <!-- <n-button type="info" block class="creator-submit-m">
                发布
            </n-button> -->
            </div>
            <div class="right">
                <div class="card-right ">
                    <h2>设置</h2>
                    <n-alert title="提示" type="info">
                        发帖则表示您同意MUGHome社区
                        <a href="" target="_blank">《使用规范》</a>和
                        <a href="" target="_blank">《发帖规范》</a>
                    </n-alert>
                    <n-form label-placement="left" ref="formRef" :model="form" :rules="rules">
                        <div class="card-right-top">
                            <n-form-item class="right-form-item" path="categoryId[0]">
                                <n-select placeholder="一级分区" v-model:value="form.categoryId[0]"
                                    :options="categorieOneOptions" @update-value="form.categoryId[1] = null" />
                            </n-form-item>
                            <n-form-item class="right-form-item" path="categoryId[1]">
                                <n-select placeholder="二级分区" clearable v-model:value="form.categoryId[1]"
                                    :options="categorieTwoOptions" />
                            </n-form-item>
                        </div>
                        <n-form-item label="封面" path="headerImage">
                            <n-upload ref="uploadComponent" :default-upload="false" accept="image/*"
                                v-model:file-list="headerImages" list-type="image-card" :max="1" />
                        </n-form-item>
                        <!-- <n-form-item label="摘要" path="description">
                        <n-input type="textarea" :placeholder="placeholder" v-model:value="form.description" />
                    </n-form-item> -->
                        <n-form-item v-if="form.categoryId[1] === 34">
                            <n-checkbox v-model:checked="form.isMONFVote">
                                参与MONF大赛打分
                            </n-checkbox>
                        </n-form-item>
                        <n-form-item>
                            <n-button @click="sendPost" type="info" block>
                                发布
                            </n-button>
                        </n-form-item>
                    </n-form>

                </div>
            </div>
        </div>
    </ScrollView>
    <n-modal v-model:show="showSuccess">
        <div class="successCard">
            <h3>发表成功！</h3>
            <p>帖子已经发布成功，接下来您想要？</p>
            <div class="successCard-footer">
                <n-button type="info" @click="router.replace({ path: `/` })">回到首页</n-button>
                <n-button type="success" @click="router.replace({ path: `/article/${post?.post.id}` })">查看详情</n-button>
            </div>
        </div>
    </n-modal>
    <n-modal v-model:show="showCheckBilibili">
        <n-input-group class="BilibiliModel">
            <n-select :style="{ width: '25%' }" :options="BilibiliOption" v-model:value="Bilibili.type" />
            <n-input placeholder="请填写视频Id" :style="{ flex: 1 }" v-model:value="Bilibili.value" />
            <n-button type="success" @click="InsteBilibili">添加</n-button>
        </n-input-group>
    </n-modal>
</template>
<script lang="ts" setup>
import ScrollView from "@/components/scrollview/scrollView.vue";
import { FormRules, SelectOption, UploadInst, UploadFileInfo, useMessage } from "naive-ui"
import { NInputGroup, NInput, NModal, NSelect, NCheckbox, NAlert, NForm, NFormItem, NButton, NUpload } from "naive-ui"
import { Categorie, getCategories } from "@/api/categorie";
import { NormalToolbar, MdEditor } from 'md-editor-v3';
import type { ExposeParam, ToolbarNames } from "md-editor-v3"
import 'md-editor-v3/lib/style.css';
import { ArticleBody, setArticle, setArticleParams } from "@/api/post";
import { uploaderFile } from "@/api/file";
import confetti from "canvas-confetti"
import { getUploadAction } from "@/utils";
import { useHead } from "@unhead/vue";
import { ref, inject, reactive, computed, nextTick } from "vue";
import { useRouter } from "vue-router";
const message = useMessage();
const router = useRouter()
const showSuccess = ref(false)
const editorRef = ref<ExposeParam>();
const toolbar: ToolbarNames[] =
    [
        'bold',
        'underline',
        'italic',
        '-',
        'title',
        'strikeThrough',
        'sub',
        'sup',
        'quote',
        'unorderedList',
        'orderedList',
        'task',
        '-',
        'codeRow',
        'code',
        'link',
        'image',
        'table',
        'mermaid',
        'katex',
        '-',
        'revoke',
        'next',
        0,
        '=',
        'preview',
        'catalog',
    ];
const showCheckBilibili = ref(false)
const BilibiliOption: SelectOption[] = [{ label: "BV号", value: 'bv', }, { label: "AV号", value: "av" }]
const Bilibili = reactive({
    value: "",
    type: ""
})
const categories = ref<Categorie[]>([])
const post = ref<ArticleBody>()
const rules: FormRules = {
    categorieId: [{
        type: "number",
        message: "请选择一级分区",
        required: true,
        trigger: ['blur'],
    }]
}
const headerImages = ref<UploadFileInfo[]>([])
const uploadComponent = ref<UploadInst>()

const form = reactive<setArticleParams>({
    categoryId: [null, null],
    title: "",
    content: "",
    isMONFVote: false,
    headerImage: "",
})
function InsteBilibili() {
    if (!Bilibili.type) { message.warning("请选择av或bv号"); return }
    if (!Bilibili.value) { message.warning("请输入av或bv号"); return }
    const params: string[] = []
    params.push(`${Bilibili.type}id="${Bilibili.value}"`)
    editorRef.value?.insert(() => ({
        targetValue: `<mug-bilibili ${params.join(" ")}></mug-bilibili>`,
        select: false,
        deviationStart: 0,
        deviationEnd: 0
    }));
    showCheckBilibili.value = false
}
async function onUploadImg(files: File[], callback: (urls: string[]) => void) {
    const arr: string[] = []
    for (const iterator of files) {
        const { data } = await uploaderFile(iterator);
        arr.push(data.UploadFileUrl)
    }
    callback(arr)
}

async function addBilibili() {
    showCheckBilibili.value = true
}

async function loadCategories() {
    const { data } = await getCategories()
    console.log(data.categories)
    return data.categories

}

loadCategories()
const categorieOneOptions = computed<SelectOption[]>(() => {
    return categories.value.map(e => ({
        label: e.name,
        value: e.id
    }))
});

const categorieTwoOptions = computed<SelectOption[]>(() => {
    const categorieId = form.categoryId[0];
    if (!categorieId) return [];
    const item = categories.value.find(e => e.id === categorieId);
    if (!item) return []
    if (!("children" in item) || !Array.isArray(item.children)) item.children = []
    return item.children.map(e => ({
        label: e.name,
        value: e.id
    }))
})
function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

async function sendPost() {
    if (uploadComponent.value && headerImages.value.length > 0) {
        form.headerImage = (await getUploadAction(headerImages.value)).join("")
    }
    if (!form.title) throw new Error("未填写标题");
    if (!form.content) throw new Error("缺少内容");
    if (form.content.length < 20) throw new Error("文章字数应不少于20");
    const body = { ...form };
    console.log(body)
    const msg = message.create("发布中", {
        type: "loading",
    })
    try {
        const { data } = await setArticle(body);
        post.value = data
        // closeToast(true);
        confetti({
            angle: randomInRange(100, 120),
            spread: randomInRange(50, 80),
            particleCount: randomInRange(50, 100),
            origin: { y: 1, x: 1 }
        });
        confetti({
            angle: randomInRange(40, 90),
            spread: randomInRange(50, 80),
            particleCount: randomInRange(50, 100),
            origin: { y: 1, x: 0 }
        });
        await nextTick();
        showSuccess.value = true

    } catch (error) {
        // closeToast(true)
        if (error instanceof Error) {
            msg.destroy()
            message.error(error.message)
        }
    }
}
useHead({
    title: "发表帖子 - MUGHome",
})


</script>
<style lang="scss" scoped>
@media screen and (max-width: 1170px) {

    .right {
        // display: none;
        width: 100% !important;
        margin-left: 0 !important;
    }

    .creator-submit-m {
        display: flex !important;
    }

    .creator {
        flex-direction: column;
    }
}

.creator-submit-m {
    display: none;
    margin-top: 16px;
}

.creator {
    display: flex;
    width: 100%;
    min-height: 100%;
    padding: 16px;
}

.BilibiliModel {
    max-width: 80%;
    width: 440px;
    padding: 24px;
    background-color: #FFFFFF;
    border-radius: 8px;
}

.right {
    margin-right: auto;
    margin-left: 16px;
    width: 430px;

    .right-form-item {
        flex: 1;

    }

    .right-form-item:first-child {
        margin-right: 24px;
    }
}

.card-right {
    background-color: var(--mug-card-bg);
    border-radius: 6px;
    padding: 20px 30px;
    margin-bottom: 14px;
    box-shadow: 0px 14px 56px -15px rgba(0, 0, 0, 0.1);

    .card-right-top {
        display: flex;
        margin-top: 20px;
    }

    h2 {
        color: var(--mug-text);
        font-size: 22px;
        margin-bottom: 16px;
    }
}

.card {
    // background-color: var(--mug-card-bg);
    border-radius: 6px;
    color: var(--mug-text);
    overflow: hidden;
    max-width: 1200px;
    width: 100%;
    flex: 1;
    margin-bottom: 16px;
    margin-left: auto;

    :deep(.categoriesPopop) {

        &::-webkit-scrollbar {
            display: none;
        }
    }
}

.titleInput {
    font-size: 26px;
    border: none;
    padding: 20px 20px 13px;
    width: 100%;
}


.successCard {
    display: flex;
    flex-direction: column;
    padding: 32px;
    max-width: calc(100vw - 32px);

    p {}

    h3 {
        font-size: 24px;
        font-weight: 400;
        color: var(--mug-text);
        text-align: center;
        margin-bottom: 16px;
    }

    &-footer {
        display: flex;
        margin: 20px 16px 0;
        justify-content: space-between;

        button {
            width: 48%;
        }
    }
}

.Editor {
    flex: 1;
}
</style>
