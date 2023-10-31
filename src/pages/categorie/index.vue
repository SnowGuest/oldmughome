
<template>
    <ScrollView @load="instance.next()">
        <div class="mainPage">
            <div class="topPage" :style="{ background: backGroundColor.rgbStr }">
                <div class="flex items-center">
                    <div class="topPage-icon-border flex items-center justify-center">
                        <i :style="{ fontSize: '30px', color: categorie?.color }" :class="categorie?.icon"></i>
                    </div>
                    <div>
                        <h2 class="topPage-name">{{ categorie?.name }}</h2>
                        <span>帖子数:若干</span>
                    </div>
                    <n-button type="info" dashed style="margin-left:auto">
                        分区规范
                    </n-button>
                </div>
                <p class="topPage-description">{{ categorie?.description }}</p>
            </div>
            <div class="leftPage">
                <div class="left-card">
                    <div class="cardHeader flex justify-between items-center">
                        <h3>全部帖子</h3>
                        <n-popselect :options="actions" size="medium" @update:value="checkSort">
                            <div class="popoverMenu">
                                <span style="margin-right:8px">{{ sortText }}</span>
                                <Icon   :width="14" :height="14"   name="arrow-down" />
                            </div>
                        </n-popselect>
                    </div>

                    <ul class="List">


                        <ArticleVue @like="setLike($event, item)" v-for=" [_, item]  in  articles" :key="item.id"
                            :user="users?.get(item.createdUserId)" :article="item" />

                    </ul>
                    <ListStatus :p-inst="instance" :status="instance.status.value"></ListStatus>
                </div>
            </div>
        </div>
    </ScrollView>
    <!-- <SideBar :check="false" :tag="false" :categorie="false" /> -->
</template>

<script lang="ts" setup>
import { NButton } from 'naive-ui';
import ScrollView from "@/components/scrollview/scrollView.vue"
import ArticleVue from "@/components/article/item.vue";
// import SideBar from '@/components/SideBar/index.vue';
// import { Popover, Icon, type PopoverAction, List } from "vant"
import { Article, ArticlesBody, getArticleList } from '@/api/post';
import { User } from '@/api/user';
import { Categorie } from '@/api/categorie';
import { getUserMap, isColorDarkOrLight, Reg2Rgb, useApiToPagination } from '@/utils';
import { ref } from 'vue';
import { useHead } from '@unhead/vue'
import { useRoute } from 'vue-router'
import { InstanceBody } from '@/utils/request';
import ListStatus from '@/components/listStatus.vue';

const users = new Map<User["id"], User>();
const route = useRoute();
const categoryId = typeof route.params.id === "string" ? route.params.id : "";

// const articles = ref<Article[]>([])
const backGroundColor = ref<ReturnType<typeof Reg2Rgb>>({ rgb: [0, 0, 0], rgbStr: "" })
const sortText = ref("最新发布")
const page = {
    page: 1,
    pageSize: 10,
    categoryId,
    sortField: "createdDate",
    sortType: "desc"
}

function setLike(bool: boolean, item: Article) {
    item.relations.isLiked = bool
}
const actions = [{ value: "likeCount", label: "最多点赞" }, { value: "createdDate", label: "最新发布" }, { value: "viewCount", label: "最多浏览" }]
function checkSort(_: any, { label, value }: (typeof actions)[number]) {
    sortText.value = label
    page.sortField = value
    instance.reload(page)
    onLoadArticle(users)
}


const categorie = ref<Categorie>()
function onLoadArticle(userMap?: typeof users) {
    return useApiToPagination<Article, InstanceBody<ArticlesBody>, "id">(getArticleList, page, "id", ({ data: { post, includes } }) => {
        getUserMap(includes.users, userMap);
        categorie.value = includes.categories.find(e => `${e.id}` === categoryId);
        backGroundColor.value = Reg2Rgb(categorie.value?.color);
        document.title = `${categorie.value?.name} - MUGHome`
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
const instance = onLoadArticle(users)
const { list: articles } = instance;

</script>
<style lang="scss" scoped>
.mainPage {
    width: 100%;
    max-width: 770px;

    margin: 0 auto;
}




.leftPage {
    max-width: 770px;
    width: 100%;
    flex: 1;
}

.topPage {
    width: 100%;
    padding: 24px 36px;
    border-radius: 6px 6px 0 0;
    // color: v-bind(textColor);



    &-user {
        font-size: 12px;
    }

    &-icon-border {
        height: 50px;
        width: 50px;
        background-color: #ffffff;
        border-radius: 16px;
        margin-right: 16px;
    }

    &-description {
        margin-top: 12px;
    }

    .cardTopIcon {
        border-radius: 12px;
        width: 140px;
        height: 140px;
        background-color: var(--mug-card-sub-bg);
        margin-right: 40px;
    }

    .cardTopTitle {
        font-size: 24px;
        font-weight: 500;
        margin-bottom: 12px;
    }

    .cardTopDescription {
        font-size: 14px;
        color: var(--mug-sub-color);
    }
}

.left-card {
    background-color: var(--mug-card-bg);
    border-radius: 0 0 6px 6px;
    margin-bottom: 14px;
    color: var(--mug-text);
}

.card {
    background-color: var(--mug-card-bg);
    border-radius: 6px;
    margin-bottom: 14px;
    color: var(--mug-text);
}

.cardHeader {
    h3 {
        font-size: 20px;
        color: var(--mug-text);
        font-weight: 500;
    }

    padding: 20px 30px;
    border-bottom: 1px solid var(--mug-dividing);
}

.pageBody {
    display: flex;
    align-items: flex-start;
}

.List {
    border-radius: 8px;
    background-color: var(--mug-card-bg);

    // min-height: 30vh;
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

.popoverMenu {
    display: flex;
    align-items: baseline;
    color: var(--mug-text);
    cursor: pointer;
}


.cardTopBg {
    object-fit: cover;
    height: 210px;
    max-height: 210px;
    overflow: hidden;
    position: relative;
    border-radius: 10px 10px 0px 0px;

    .frosted_glassBox {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        backdrop-filter: blur(16px);
    }

    img {
        object-fit: cover;
        width: 100%;
    }
}

.topPageContent {
    position: relative;
    z-index: 10;
    margin-top: -40px;
    padding: 0px 60px 30px;
}
</style>
