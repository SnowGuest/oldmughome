<template>
    <div class="headerCard">
        <div class="userBg">
            <background :src="user?.userCoverUrl" />
            <div class="frosted_glassBox">
                <div class="Editor flex justify-center items-center" v-if="self">
                    <box-icon name='edit-alt' color="#FFFFFF" style="width:20px;height:20px"></box-icon>
                    <span>编辑</span>
                    <input type="file" class="uploadCoverBg" @change="uploadCoverBg" accept="image/*">
                </div>
            </div>
        </div>
        <div class="items-center flex userHeader">
            <n-avatar v-if="user?.avatarUrl" round :size="120" :src="user?.avatarUrl" />
            <div v-else class="userHeaderColor" :style="`background-color:${getColor()}`">
                {{ user?.nickName[0] }}
            </div>
            <div class="user">
                <div class="nickName">{{ user?.nickName }}</div>
                <div class="userSub">已注册{{ userJoinDay }}天</div>
            </div>
        </div>

        <ul class="flex items-center userDetali">
            <li class="flex items-center justify-center flex-col">
                <span class="sum">{{ user?.postCount || "0" }}</span>
                <span class="sumText">帖子</span>
            </li>
            <li class="flex items-center justify-center flex-col">
                <span class="sum"> {{ user?.followerCount || "0" }}</span>
                <span class="sumText">粉丝</span>
            </li>
            <li class="flex items-center justify-center flex-col" v-if="self">
                <span class="sum">{{ user?.points || "0" }}</span>
                <span class="sumText">我的积分</span>
            </li>
        </ul>
    </div>
    <div class="userPost">
        <!-- <Tabs v-model:active="active" shrink>
            <Tab title="帖子" title-class="TabTitle">
                <List finished-text="没有更多了" :immediate-check="false" v-model:loading="articleLoading"
                    :finished="articleFinished" :error="articleError" error-text="请求数据失败" @load="onArticleLoad">
                    <ul class="List">
                        <ArticleVue :attentionShow="!self" v-for="[_, item] in articles" :key="item.id"
                            :user="users?.get(item.createdUserId)" :article="item" />
                    </ul>
                    <template #error>
                        <Empty image="network" description="请求数据失败,点击重试"></Empty>
                    </template>
                </List>
            </Tab> -->

        <n-tabs v-model:active="active" shrink>
            <n-tab-pane name="帖子">
                <ul class="list">
                    <ArticleVue :attentionShow="!self" v-for=" [_, item]  in  articles" :key="item.id"
                        :user="users?.get(item.createdUserId)" :article="item"
                        :categorie="item.relations ? item.relations.categoryIds?.map(e => e !== null ? categories.get(e) : undefined).filter(e => e) : []" />
                </ul>
                <ListStatus :status="articlePagination.status.value" :p-inst="articlePagination" />
            </n-tab-pane>
        </n-tabs>
    </div>
</template>

<script lang="ts" setup>

// import { Image, Tabs, Tab, List, Empty, showSuccessToast } from "vant"
import ListStatus from '@/components/listStatus.vue';
import { useUserStore } from '@/stores/user';
import { storeToRefs } from "pinia";
import ArticleVue from "@/components/article/item.vue";
import { getUserInfo, updateUserInfo, User } from "@/api/user";
import { Article, ArticlesBody, getArticleList } from "@/api/post";
import background from "@/components/background.vue";
import dayjs from "dayjs/esm";
import { getUserMap, useApiToPagination } from "@/utils";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useMessage } from "naive-ui";
import { InstanceBody } from "@/utils/request";
import { Categorie } from "@/api/categorie";
function getColor() {
    return `#${Math.random().toString(16).substr(-6)}`
}
interface Props {
    self: boolean
}
const props = defineProps<Props>()


const user = ref<User | null>(null);
const userJoinDay = ref<number>(0)
const active = ref(0)
const categories = new Map<Categorie["id"], Categorie>();

const route = useRoute()



const page = {
    page: 1,
    pageSize: 10,
    postUserId: route.params.id,
}

const users = new Map<number, User>()
async function onLoadUserInfo() {
    if (typeof route.params.id === "string") {
        const { data } = await getUserInfo(route.params.id);
        user.value = data
        userJoinDay.value = dayjs().diff(dayjs(user.value.createdDate), 'day')
    }
}

const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore)
const message = useMessage()
async function uploadCoverBg(e: Event) {
    const input = e.target;
    let files: FileList | null = null
    if (input instanceof HTMLInputElement) files = input.files;
    if (files === null || files.length !== 1) return;
    const file = files.item(0)
    if (file === null) return;
    const fileType = file.type.split("/")[0]
    const id = userInfo.value?.id
    if (!id) return;
    if (fileType === "image") {
        const { data, code } = await updateUserInfo(id, {
            userCover: file
        })

        if (code === 0 && props.self) {
            user.value = data.user
            userStore.setLogged(data);
            message.success("修改成功");
        }
    }

}
onLoadUserInfo()
function onLoadArticle(userMap?: typeof users) {
    return useApiToPagination<Article, InstanceBody<ArticlesBody>, "id">(getArticleList, {
        page: 1,
        pageSize: 10,
        postUserId: route.params.id,
    }, "id", ({ data: { post, includes } }) => {
        getUserMap(includes.users, userMap);
        includes.categories.forEach(e => {
            categories.set(e.id, e)
        })
        return post.map(e => {
            if (typeof e.relations === "undefined") {
                e.relations = {
                    postLikeUserId: [],
                    isLiked: false,
                    categoryIds: [0, null],
                    commentIds: [],
                }
                if (typeof e.relations.isLiked !== "boolean") {
                    e.relations.isLiked = false
                }
                if (!Array.isArray(e.relations.categoryIds)) {
                    e.relations.categoryIds = [0, null]
                }
            }
            return e
        })
    });
}
const articlePagination = onLoadArticle(users)
const { list: articles } = articlePagination;
</script>
<style lang="scss" scoped>
.userHeaderColor {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    z-index: 1;
}

@media screen and (max-width: 1170px) {

    .mainPage {
        max-width: 100vw;
    }
}

.mainPage {
    flex: 1;
    max-width: 770px;
    width: 100%;
}

.headerCard {
    border-radius: 8px;
    background-color: var(--mug-card-bg);
    margin-bottom: 12px;
    padding-bottom: 30px;
    box-shadow: 0px 37px 50px -14px rgba(0, 0, 0, 0.1);
    overflow-x: hidden;
}

.List {

    li:last-child {
        &::after {
            display: none;
        }
    }

    li {
        position: relative;

        &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            background-color: var(--mug-dividing);
            height: 1px;
            width: 90%;
        }
    }
}

.userDetali {
    padding-bottom: 16px;
    padding-left: 46px;
    margin-top: 50px;

    li:last-child::after {
        display: none;
    }

    .sum {
        font-size: 16px;
        color: var(--mug-text);
    }

    .sumText {
        color: var(--mug-sub-text);
        font-size: 14px;
    }

    li {
        width: 80px;
        position: relative;

        &::after {
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            content: "";
            height: 40%;
            width: 1px;
            background-color: var(--mug-tag-line);
        }
    }
}

.userHeader {
    padding-left: 50px;
    margin-top: -40px;
}

.user {
    margin-left: 16px;
    padding-top: 40px;

    .userSub {
        font-size: 14px;
        color: var(--mug-sub-text);
    }

    .nickName {
        white-space: nowrap;
        font-size: 22px;
        margin-bottom: 6px;
        color: var(--mug-text);
    }
}

.userBg {
    object-fit: cover;
    height: 210px;
    max-height: 210px;
    overflow: hidden;
    position: relative;
    border-radius: 10px 10px 0px 0px;

    .frosted_glassBox {
        position: absolute;
        bottom: 12px;
        right: 12px;
        // width: 100%;
        // height: 100%;

        .Editor {
            border-radius: 6px;
            padding: 6px 12px;
            background-color: rgba(0, 0, 0, 0.5);

            position: relative;

            .uploadCoverBg {
                opacity: 0;
                width: 100%;
                height: 100%;
                transform: scale(1.1);
                top: 0;
                left: 0;
                position: absolute;
                cursor: pointer;

                &::file-selector-button {
                    cursor: pointer;
                }
            }

            span {
                margin-left: 6px;
                font-size: 14px;
                color: #FFF;
            }
        }

        // backdrop-filter: blur(1px);
    }

    img {
        object-fit: cover;
        width: 100%;
    }
}

.userPost {
    border-radius: 8px;
    background-color: var(--mug-card-bg);
    padding: 10px 20px;

    :deep(.TabTitle) {
        font-size: 18px;
        font-weight: 500;
    }
}
</style>
