
<template>
    <div class="creator">
        <div class="card column">
            <input v-model="form.title" type="text" class="titleInput" placeholder="标题">
            <MdEditor @on-upload-img="onUploadImg" @on-save="saveDraft" :toolbarsExclude="toolbar" class="Editor"
                v-model="form.content"></MdEditor>
            <n-button type="info" block class="creator-submit-m">
                发布
            </n-button>
        </div>
        <div class="right">
            <div class="card-right ">
                <h2>设置</h2>
                <n-alert title="提示" type="info">
                    发帖则表示您同意MUGHome社区
                    <a href="" target="_blank">《使用规范》</a>和
                    <a href="" target="_blank">《发帖规范》</a>
                </n-alert>
                <n-form label-placement="left" ref="formRef" :model="form" :rules="rules" disabled>
                    <div class="card-right-top">
                        <n-form-item class="right-form-item" path="categoryId[0]">
                            <n-select placeholder="一级分区" v-model:value="form.categoryId[0]" :options="categorieOneOptions"
                                @update-value="form.categoryId[1] = null" />
                        </n-form-item>
                        <n-form-item class="right-form-item" path="categoryId[1]">
                            <n-select placeholder="二级分区" v-model:value="form.categoryId[1]"
                                :options="categorieTwoOptions" />
                        </n-form-item>
                    </div>
                    <n-form-item label="封面" path="headerImage">
                        <n-upload list-type="image-card" />
                    </n-form-item>
                    <n-form-item v-if="form.categoryId[1] === 34">
                        <n-checkbox v-model:checked="form.isMONFVote">
                            参与MONF2023评分
                        </n-checkbox>
                    </n-form-item>
                    <n-form-item>
                        <n-button @click="sendPost" type="info" block>
                            重新发布
                        </n-button>
                    </n-form-item>
                </n-form>

            </div>
        </div>
    </div>
    <n-modal round :show="showSuccess" position="center">
        <div class="successCard">
            <h3>发表成功！</h3>
            <p>帖子已经发布成功，接下来你想要</p>
            <div class="successCard-footer">
                <n-button type="info" @click="router.replace({ path: `/` })">回到首页</n-button>
                <n-button type="success" @click="router.replace({ path: `/article/${post?.post.id}` })">查看详情</n-button>
            </div>
        </div>
    </n-modal>
</template>
<script lang="ts" setup>
import { FormRules, useMessage } from "naive-ui"
import { NSelect, NCheckbox, NUpload, NAlert, NForm, NFormItem, NButton } from "naive-ui"
import type { SelectOption } from "naive-ui"
// import { Button, Popup, closeToast, showFailToast, showLoadingToast, showSuccessToast } from "vant"
import { Categorie, getCategories } from "@/api/categorie";
import type { ToolbarNames } from 'md-editor-v3';
import { MdEditor } from 'md-editor-v3';

import { ArticleBody, getArticle, setArticle, updateArticle, updateArticleParams } from "@/api/post";
import { uploaderFile } from "@/api/file";
import confetti from "canvas-confetti";
import { ref, inject, reactive, computed, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const message = useMessage()
const route = useRoute();
if (!route.params.id) throw new Error("意外的错误");
const id = typeof route.params.id === "string" ? route.params.id : route.params.id.join("")

const showSuccess = ref(false)
const toolbar: ToolbarNames[] = ["github", "htmlPreview"]
const post = ref<ArticleBody>()
const rules: FormRules = {
    categorieId: [{
        type: "number",
        message: "请选择一级分区",
        required: true,
        trigger: ['blur'],
    }]
}



const form = reactive<updateArticleParams>({
    categoryId: [null, null],
    title: "",
    content: "",
    isMONFVote: false,
    id: "",
    LastEditedDate: null
})
function saveDraft() {
    console.log("触发保存草稿箱")
    console.log(form.content)
}
async function onUploadImg(files: File[], callback: (urls: string[]) => void) {
    const arr: string[] = []
    for (const iterator of files) {
        const { data, code } = await uploaderFile(iterator);
        if (code === 0) {
            arr.push(data.UploadFileUrl)
        }
    }
    callback(arr)
}


const categories = ref<Categorie[]>([])
async function loadCategories() {
    const { data, code } = await getCategories()
    if (code !== 0) return
    return data.categories

}
async function loadPost(id: string) {
    try {
        const { data, code } = await getArticle({ id, page: 1, pageSize: 1 })
        if (code !== 0) return
        if (data) {
            post.value = data;
            form.title = data.post.title;
            form.content = data.post.content;
            form.categoryId = data.post.relations.categoryIds;
            form.id = data.post.id;
            if ("monfVoteInfoId" in data.post) form.isMONFVote = true
        }
        return data
    } catch (error) {

    }
}

loadCategories();
loadPost(id)

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
    if (!form.title) throw new Error("未填写标题");
    if (!form.content) throw new Error("缺少内容");
    if (form.content.length < 20) throw new Error("文章字数不得少于20");
    const body = { ...form };
    console.log(body)

    const msg = message.create("发布中", {
        type: "loading",
    })
    try {

        const { data } = await updateArticle(body);
        post.value = data
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
        console.log("进入成功")
        showSuccess.value = true
        // confetti.render();
        // if (data.value?.code === 0) {
        //     showSuccessToast("发表成功!")
        // }

    } catch (error) {
        if (error instanceof Error) {
            msg.destroy()
            message.error(error.message)
        }
    }
}
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
    padding: 0 16px;
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
    background-color: var(--mug-card-bg);
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
