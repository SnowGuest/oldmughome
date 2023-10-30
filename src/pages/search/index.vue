<template>
    <ScrollView @load="articlePagination.next">
        <div class="searchPageBody">
            <div class="searchStickyBody">
                <div class="searchBody flex items-center">
                    <input type="text" v-model="searchText" />
                    <n-button class="ml-3" type="info">搜索全站</n-button>


                </div>
                <n-tabs>
                    <n-tab v-for="(e, i) in tabs" :key="e" :name="e" class="tabText">

                    </n-tab>
                </n-tabs>
            </div>
            <ul class="list">
                <ArticleVue @like="setLike($event, item)" v-for=" [_, item]  in  articles" :key="item.id"
                    :user="users?.get(item.createdUserId)" :article="item"
                    :categorie="item.relations ? item.relations.categoryIds?.map(e => e !== null ? categories.get(e) : undefined).filter(e => e) : []" />
            </ul>
            <ListStatus :status="articlePagination.status.value" :p-inst="articlePagination" />
        </div>
    </ScrollView>
</template>

<script lang="ts" setup>
import { Categorie } from '@/api/categorie';
import { Article, ArticlesBody, getArticleList } from '@/api/post';
import { User } from '@/api/user';
import { useApiToPagination, getUserMap } from '@/utils';
import { InstanceBody } from '@/utils/request';
import { ref } from 'vue';
import { useRoute } from "vue-router"
import ArticleVue from "@/components/article/item.vue";
import ScrollView from '@/components/scrollview/scrollView.vue';
import ListStatus from '@/components/listStatus.vue';

const tabs = ["帖子", "用户"]
const searchText = ref("");
const route = useRoute();
if ("query" in route.query && typeof route.query.query === "string") {
    searchText.value = route.query.query
}

const users = new Map<User["id"], User>();
const categories = new Map<Categorie["id"], Categorie>();
function onLoadArticle(userMap?: typeof users) {
    // try {
    // pageLoading.value = true;
    return useApiToPagination<Article, InstanceBody<ArticlesBody>, "id">(getArticleList, {
        page: 1,
        pageSize: 10,
        content: searchText.value
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
function setLike(bool: boolean, item: Article) {
    item.relations.isLiked = bool
}
const articlePagination = onLoadArticle(users)
const { list: articles } = articlePagination;
</script>
<style lang="scss" scoped>
.searchPageBody {
    height: 100%;
    width: 1000px;
    max-width: 100vw;
    margin: 10vmin auto 0;

    :deep(.tabText) {
        font-size: 18px;
        font-weight: 600;
    }
}

.searchStickyBody {
    position: sticky;
    top: -16px;
    z-index: 1919810;
    background-color: #F9FAFB;
}

.searchBody {
    width: 100%;
    border-bottom: 1px solid #000;
    min-height: 46px;
    margin-bottom: 5vmin;
    padding: 16px 0;


    input {
        background-color: transparent;
        border: none;
        height: 100%;
        outline: none;
        flex: 1;
        font-size: 38px;
        font-weight: 200;
    }
}

.list {
    border-radius: 8px;

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
</style>