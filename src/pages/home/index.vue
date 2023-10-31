<template>
    <ScrollView @load="articlePagination.next()">

        <div class="flex justify-center main_pageBox">
            <div class="main_page">
                <n-carousel show-arrow class="swiper">
                    <div class="swiper-image" v-for="image in  banners ">
                        <img draggable="false" :src="image.imageUrl" alt="图片加载失败" />
                        <div class="swiper-image-mask">
                            <span>{{ image.description }}</span>
                            <button>
                                <RouterLink :to="image.linkUrl" target="_blank">
                                    查看详情
                                </RouterLink>
                            </button>
                        </div>
                    </div>

                </n-carousel>

                <ul class="list">
                    <ArticleVue @like="setLike($event, item)" v-for=" [_, item]  in  articles" :key="item.id"
                        :user="users?.get(item.createdUserId)" :article="item"
                        :categorie="item.relations ? item.relations.categoryIds?.map(e => e !== null ? categories.get(e) : undefined).filter(e => e) : []" />
                </ul>
                <ListStatus :status="articlePagination.status.value" :p-inst="articlePagination" />

            </div>
            <SideBar />
        </div>
    </ScrollView>
</template>

<script lang="ts" setup>
import { useHead } from '@unhead/vue'
import { NCarousel } from "naive-ui"
import ArticleVue from "@/components/article/item.vue";
import SideBar from '@/components/sideBar/index.vue';
import ScrollView from "@/components/scrollview/scrollView.vue"
import { Article, ArticlesBody, getArticleList } from '@/api/post';

import { Categorie } from '@/api/categorie';
import { Banner, getBanners } from '@/api';
import { User } from '@/api/user';
import { getUserMap, useApiToPagination, useApiToPaginationInstance } from '@/utils';
import { ref } from 'vue';
import { InstanceBody } from '@/utils/request';
import ListStatus from '@/components/listStatus.vue';

const users = new Map<User["id"], User>();
const categories = new Map<Categorie["id"], Categorie>();
const banners = ref<Banner[]>([])

// const pageLoading = ref(false);
// const pageError = ref(false)
// const pageFinished = ref(false);
// const page = 1
// let articles = ref<Map<Article["id"], Article>>(new Map())
// let articlePagination = getDefaultPInstance<Article, "id">();
function onLoadArticle(userMap?: typeof users) {
    return useApiToPagination<Article, InstanceBody<ArticlesBody>, "id">(getArticleList, {
        page: 1,
        pageSize: 10
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
// async function init() {
//     const [banners, article] = await Promise.all([onLoadBanners(), onLoadArticle()])
//     return {
//         banners,
//         users: article?.users || new Map<number, User>(),
//         categories: article?.categories || new Map<number, Categorie>()
//     }
// }
// async function pageLoad() {
//     page.page++
//     const data = await onLoadArticle(users);
//     if (data) {
//         Array.from(data.categories).forEach(([i, e]) => {
//             categories.set(i, e)
//         })
//     }
// }
async function onLoadBanners() {
    const { data } = await getBanners();
    banners.value = data.banners
}

// const { users, banners, categories } = await init();
// articlePagination
onLoadBanners()
const articlePagination = onLoadArticle(users)
const { list: articles } = articlePagination;
// base?.setLoading(false);
useHead({
    title: "首页 - MUGHome",
})
</script>
<style lang="scss" scoped>
.main_pageBox {
    width: 100%;
    padding-top: 16px;
}

.main_page {
    flex: 1;
}

.main_page,
.swiper {
    max-width: 770px;

}

.swiper {
    height: 330px;
    margin-bottom: 12px;
    background-color: var(--mug-card-bg);
    border-radius: 8px;
}

.swiper_image_link {
    width: 100%;
    height: 100%;
}

.swiper-image {
    width: 100%;
    height: 100%;
    user-select: none;
    border-radius: 16px;
    position: relative;

    button {
        padding: 5px 20px;
        border-radius: 5px;
        border: none;
        background: linear-gradient(135deg, #6e8efb, #a777e3);
        cursor: pointer;
        transition: all 0.21s;

        &:active {
            transform: scale(0.95);
        }
    }



    img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }

    &-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.1);
        box-shadow: 0px -90px 53px -16px rgba(0, 0, 0, 0.4) inset;
        display: flex;
        align-items: flex-end;
        justify-content: flex-start;
        padding: 0 0 11px 10%;

        span {
            margin-right: 24px;
            margin-bottom: 5px;
        }

        * {
            font-size: 16px;
            color: #ffffff;

        }
    }
}

.list_error {
    border-radius: 8px;
    background-color: var(--mug-card-bg);
}

.list {
    min-height: 40vh;
    border-radius: 8px;
    background-color: var(--mug-card-bg);

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
