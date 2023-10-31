<!--  -->
<template>
    <li class="article">
        <RouterLink :to="`/account/${user?.id}`" target="_blank" class="pr-3">
            <n-avatar v-if="user?.avatarUrl" round :size="46" :src="user?.avatarUrl" alt="头像" />
            <div v-else-if="user" class="user-headers user_head" :style="`background-color:${getColor()}`">
                {{ user.nickName[0] }}
            </div>
        </RouterLink>
        <div class="article_body" :class="{ articleBodyTop: Boolean(user?.bio) }">
            <div class="flex justify-between items-center">
                <RouterLink :to="`/account/${user?.id}`" target="_blank">
                    <h4 class="nick_name">{{ user?.nickName }}</h4>
                    <span class="bio" :title="user?.bio">{{ user?.bio }}</span>
                </RouterLink>
                <n-button @click.stop="attention($event)" v-show="attentionShow" style="height:32px" round plain
                    type="default">关注</n-button>
                <n-button v-if="!attentionShow" style="height:32px" round plain type="primary">
                    <RouterLink target="_blank" :to="`/compile/${article.id}`">编辑</RouterLink>

                </n-button>
            </div>
            <RouterLink :to="`/article/${article.id}`" target="_blank" rel="bookmark">
                <h2 class="aricle_title">{{ article.title }}</h2>
            </RouterLink>
            <RouterLink :to="`/article/${article.id}`" target="_blank" rel="bookmark" class="aricleContent-Body">
                <div class="aricleContent">
                    {{ article.introduction }}
                </div>
                <div class="aricleContent-Body-image" v-if="article.headerImage">
                    <n-image lazy class="imgInstan" :src="article.headerImage" alt="帖子图片" />
                </div>
            </RouterLink>
            <time class="creat_time">发布于 · {{ createTime }}</time>
            <div class="aricle_controls">
                <ArticleTag :tags="categorie" />
                <RouterLink :to="`/article/${article.id}/#comment`" target="_blank" rel="bookmark"
                    class="flex items-center justify-between control_model">
                    <box-icon name='message-square-dots'></box-icon>
                    <span>{{ article.commentCount }}</span>
                </RouterLink>
                <div :class="{ noLiked: !article.relations.isLiked }"
                    class="flex  items-center justify-between control_model" @click.prevent="likeThis">
                    <box-icon v-show="article.relations.isLiked" name='heart'></box-icon>
                    <box-icon v-show="!article.relations.isLiked" name='heart' type='solid' color='#fb0101'></box-icon>
                    <span>{{ likeCount }}</span>
                </div>
                <div class="aricle_footer">
                    <span>浏览 {{ article.viewCount }}</span>
                </div>
            </div>

        </div>
    </li>
</template>

<script lang="ts" setup>
// import { BeakerIcon } from '@heroicons/vue/24/solid'
// import { GameControllerOutline, GameController } from '@vicons/fluent'
import type { User } from "@/api/user";
import ArticleTag from "@/components/article/tag.vue"
import { type Article, attentionUser, like } from "@/api/post";
import dayjs from "dayjs"
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import type { Categorie } from "@/api/categorie";
import { ref, computed } from "vue";
import { useMessage } from "naive-ui"
const message = useMessage()
interface Emit {
    (event: 'like', bool: boolean): void
}
interface Prop {
    user?: User;
    article: Article;
    attentionShow?: boolean;
    categorie?: (Categorie | undefined)[]
}
const store = useUserStore();
const { logged } = storeToRefs(store)
const emit = defineEmits<Emit>()
const prop = withDefaults(defineProps<Prop>(), {
    attentionShow: true
});
// /** @description 当前用户是否点赞了*/
// const userLike = ref<boolean>(false)
/** @description 点赞的人数 */
const likeCount = ref(prop.article.likeCount);


/** @description 返回上次发布的时间 超过12小时则是 YYYY-MM-DD */
const createTime = computed(() => {
    const articleCreateTime = prop.article.createdDate
    return dayjs(dayjs()).diff(articleCreateTime, "hour") > 12 ? dayjs(articleCreateTime).format("YYYY/MM/DD HH:mm") : dayjs(articleCreateTime).fromNow();
});

async function likeThis() {
    if (!logged.value.login) {
        message.warning("您还未登录");
        return;
    }
    let isLike = prop.article.relations.isLiked;
    if (isLike === false) isLike = undefined;
    const { code } = await like(prop.article.id, isLike);
    if (code === 0) {
        const sum = isLike ? -1 : 1
        emit("like", !isLike)
        message.success(isLike ? "取消点赞" : "点赞成功");
        likeCount.value += sum
    }
}
/**
 * @description - 关注此用户
 * */
async function attention(e: MouseEvent) {
    e.preventDefault()
    if (!logged.value.login) {
        message.warning("您还未登录");
        return;
    }
    if (prop.user == null) {
        throw new Error("用户不存在");
    }
    const id = prop.user.id;
    await attentionUser(id);
    likeCount.value++
}
function getColor() {
    return `#${Math.random().toString(16).substr(-6)}`
}
</script>
<style lang="scss" scoped>
@media screen and (max-width: 768px) {
    .article {
        padding: 20px !important;
    }
}

.article {
    display: flex;
    align-items: flex-start;
    color: var(--mug-text);
    padding: 24px 24px 20px;
    cursor: pointer;
    background-color: var(--mug-card-bg);

    .user_head {
        margin-right: 10px;
        min-width: 46px;

    }

    .article_body {
        flex: 1;
        max-width: calc(100% - 56px);
    }

    .articleBodyTop {
        padding-top: 6px;
    }

    .nick_name {
        font-size: 16px;
        font-weight: 400;
    }

    .bio {
        display: block;
        font-size: 12px;
        color: var(--mug-sub-text);
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: 5px;
    }

    .aricle_title {
        font-size: 18px;
        font-weight: 500;
        margin-top: 16px;

        &:hover {
            opacity: 0.8;
        }
    }

    .aricleContent-Body {
        display: flex;

        &-image {
            // margin-left: 12px;
            height: 133px;
            width: 200px;
            margin-left: auto;

            .imgInstan {
                border-radius: 8px;
                object-fit: cover;
                max-width: 100%;
                height: 100%;
                width: 100%;
                max-height: 100%;
            }

        }
    }

    .aricleContent {
        margin-top: 10px;
        min-height: 32px;
        // max-height: 64px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        font-size: 14px;
        color: #868585;
        font-size: 16px;
        font-weight: 500;
        line-height: 24px;
        position: relative;
        max-width: 70%;
        white-space: pre-wrap;

        &:hover {
            opacity: 0.8;
        }

        :deep(h1, h2, h3, h4, h5, h6, ul, li, ol) {
            position: absolute;
            top: 0;
            left: 0;
            visibility: hidden !important;
            opacity: 0;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        :deep(p) {
            display: inline;
        }

        :deep(strong) {
            font-weight: 400;
        }
    }

    .creat_time {
        font-size: 12px;
        color: #666666;
        margin-top: 16px;
        display: flex;
    }

    .aricle_footer {
        width: 70px;
        text-align: end;
        font-size: 14px;
        color: #888888;
    }
}

.control_model {
    width: 45px;
    
    margin-right: 30px;
}

.control_model_like {
    // transform: translateY(-2px);
    // align-items: flex-end;
}

.noLiked {
    svg {
        transform: translateY(2px);
    }
}

.aricle_controls {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    margin-top: 16px;
}

.user-headers {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    font-size: 24px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>