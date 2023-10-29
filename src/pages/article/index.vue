<template>
    <div class="mainPage">
        <div class="card flex column" id="card">
            <div class="flex items-center">
                <Image v-if="user?.avatarUrl" round :src="user?.avatarUrl" width="62" height="62" alt="头像" />
                <div v-else class="userHeader" :style="`background-color:${getColor()}`">
                    {{ user?.nickName[0] }}
                </div>
                <div class="justify-center items-center flex">
                    <div class="nickName flex column">
                        <span>{{ user?.nickName }}</span>
                        <time class="createTime"> 发布于 {{ createTime }}</time>
                        <!-- <span style="margin-top:4px">{{ user?.role }}</span> -->
                    </div>
                </div>
                <div class="attention">
                    <Button v-if="!user?.relations?.isSubscribed" type="primary" round :loading="followLoading"
                        @click="followUser(user)">关注</Button>
                    <Button v-else round :loading="followLoading" @click="unfollowUser(user)">取消关注</Button>
                </div>
            </div>
            <h2 class="title">{{ article?.title }}</h2>
            <MdPreview @get-catalog="showCatalog = Array.isArray($event) && $event.length > 0" :editorId="markDownState.id"
                :theme="appInstance?.theme" class="articleContent" :model-value="article?.content" preview preview-only />
            <ArticleTag />
            <div class="lockUser " id="comments" ref="commentsDom">{{ article?.viewCount }}人浏览
                <Popover :actions="actions">
                    <template #reference>
                        <Icon name="ci:more-horizontal" class="moreMenu" />
                    </template>
                </Popover>
            </div>
            <div class="likeUsers flex justify-center items-center flex column" v-show="article && likeUsers.size > 0">
                <span>{{ article?.likeCount }}人表示很赞</span>
                <ul class="likeUsersElement">
                    <li v-for="[id, item] in likeUsers">
                        <Image round :src="users.get(id)?.avatarUrl" width="32" height="32" alt="头像"></Image>
                    </li>
                </ul>
            </div>

        </div>

        <div class="commentCard flex column">
            <div class="flex justify-between commentCard_header">
                <h3>全部评论</h3>
                <ol class="selectComment">
                    <li @click="setCommentType(ArticleSortField.LikeCount)"
                        :class="{ CommentTypeActive: searchParams.sortField === ArticleSortField.LikeCount }">热门</li>
                    <li class="diviving"></li>
                    <li @click="setCommentType(ArticleSortField.createdDate)"
                        :class="{ CommentTypeActive: searchParams.sortField === ArticleSortField.createdDate }">时间</li>
                </ol>
            </div>
            <comment v-model:status="commentStatus" @comment="ShowModel" :next="nextComment" :users="users"
                :comments="comments" :scores="scores" />
        </div>
        <aside class="cardFooter flex items-center">
            <div class="openInput " @click="ShowModel(article?.id, false)">说点什么吧~</div>
            <div class="flex justify-between column commentIconBox" @click="ShowModel(article?.id, false)">
                <Icon name="ci:message-writing" />
                <div class="iconSum">{{ comments.size }}</div>
            </div>
            <div class="flex justify-between column likeIconBox" @click="like_this">
                <Icon :class="{ isliked: article?.relations.isLiked }"
                    :name="article?.relations.isLiked ? 'flat-color-icons:like' : 'ci:heart-outline'" />
                <div class="iconSum">{{ article?.likeCount }}</div>
            </div>
        </aside>
    </div>
    <SideBar :tag="false" :check="false">
        <div class="newcard ">
            <div class="newCardUserBg">
                <background :src="user?.userCoverUrl" />
            </div>
            <div class="newcardBody column flex justify-center items-center">
                <div class="flex items-center">
                    <NuxtLink target="_blank" :to="`/account/${user?.id}`">
                        <Image round :src="user?.avatarUrl" width="62" height="62" alt="头像" />
                    </NuxtLink>
                    <div class="newcardBodyRight">
                        <h5>{{ user?.nickName }}</h5>
                        <span class="bio">{{ user?.bio || "这位用户没有简介哦~" }}</span>
                    </div>
                </div>

                <ul class="flex items-center userDetali">
                    <li class="column flex justify-center items-center">
                        <span class="sum">{{ user?.postCount || 0 }}</span>
                        <span class="sumText">帖子</span>
                    </li>
                    <li class="column flex justify-center items-center">
                        <span class="sum"> {{ user?.followerCount || 0 }}</span>
                        <span class="sumText">粉丝</span>
                    </li>
                </ul>

                <div class="userSub">已注册{{ userJoinDay }}天</div>
            </div>
        </div>


        <div class="newcard" style="padding:16px" v-if="showCatalog">
            <h3>目录</h3>
            <MdCatalog class="postCatalog" :editorId="markDownState.id" scrollElement="#pageBody" />
        </div>
    </SideBar>
    <ShowComment :showVote="showVote" :is-vote="isVote" @success="commentSuccess" :post-id="selectComment.postId"
        :comment-id="selectComment.id" v-model:show="selectComment.show" />
</template>

<script lang="ts" setup>
import { NButton } from "naive-ui"
import background from '@/components/background.vue';
import { MdPreview, MdEditor, MdCatalog } from 'md-editor-v3';
import ArticleTag from '@/components/article/tag.vue';
import SideBar from '@/components/sideBar/index.vue';
import { Image, Popover, showFailToast, Button, showSuccessToast } from "vant"
import comment from "@/components/comment/comment.vue"
import { storeToRefs } from "pinia";
import { User, followUserApi, unfollowUserApi } from '@/api/user';
import { ArticleBody, type Comment, getArticle, ArticleSortField, like, GetArticleParams, MonfVoteDetail, MonfVote } from '@/api/post';
import dayjs from 'dayjs';
import ShowComment from '@/components/article/showComment.vue';
import { useUserStore } from '@/stores/user';
import { APP } from "@/app.vue";
import { init, getArticleInfo } from "@/components/article/preload"
export interface CommentStatus {
    finished: boolean,
    loading: boolean,
}
export interface ArticlePageAPI {
    setMoveDetali: (id: number, value: MonfVoteDetail) => void
}



const showVote = ref(false)
const showCatalog = ref(false)
// App实例
const appInstance = inject<APP>("APP")
// 评论Dom
const commentsDom = ref<HTMLDivElement>();


// loading 
const followLoading = ref(false)


const { logged } = storeToRefs(useUserStore())
const route = useRoute();
const id = typeof route.params.id === "string" ? route.params.id : null;
if (!id) throw new Error("此帖子不存在或已被删除");
const data = await init(id)
const { article,
    scores,
    searchParams,
    selectComment,
    markDownState,
    likeUsers,
    myMonfVote,
    comments,
    isVote,
    userJoinDay,
    commentEnd,
    user,
    users,
    monfVoteInfo,
    commentStatus } = data;
// const searchParams = reactive<GetArticleParams>({
//     sortField: ArticleSortField.createdDate,
//     sortType: "desc",
//     page: 1,
//     pageSize: 10,
//     id,
// });
// const commentStatus = reactive<CommentStatus>({
//     finished: false,
//     loading: false,
// })
async function setCommentType(e: ArticleSortField) {
    try {
        if (!id) return;
        const page = searchParams.page
        const pageSize = searchParams.pageSize
        searchParams.page = 1
        searchParams.pageSize = comments.value.size;
        searchParams.sortField = e;
        commentStatus.finished = false;
        commentStatus.loading = true;
        comments.value.clear()
        const result = await getArticleInfo(id, searchParams, users, "article/info/checkAction");
        commentStatus.finished = typeof result?.commentEnd === "boolean" ? result?.commentEnd : false;

        searchParams.page = page
        searchParams.pageSize = pageSize
    } finally {
        commentStatus.loading = false;
    }

}
const actions: any[] = [];// [{ text: "举报" }]

async function nextComment() {
    try {
        if (!id) return;
        if (!searchParams.page) return
        searchParams.page++;
        commentStatus.loading = true
        const result = await getArticleInfo(id, searchParams, users, "article/comment/next");
        if (result?.scores) scores.value = result.scores.value
        commentStatus.loading = true
        commentStatus.finished = typeof result?.commentEnd === "boolean" ? result?.commentEnd : false
    } finally {
        commentStatus.loading = false
    }
}

/*  异步渲染定位逻辑 */
onMounted(() => {
    if (location.href.endsWith("#comments")) {
        setTimeout(() => {
            commentsDom.value?.scrollIntoView();
        })
    }
});

const createTime = computed(() => {
    const articleCreateTime = article.value?.createdDate
    return dayjs(dayjs()).diff(articleCreateTime, "hour") > 12 ? dayjs(articleCreateTime).format("YYYY/MM/DD HH:mm") : dayjs(articleCreateTime).fromNow();
})

useHead({
    title: `${article.value?.title} - MUGHome`
})



/* 关注用户  */
async function followUser(user?: User | null) {
    if (!user || followLoading.value) return;
    followLoading.value = true

    try {
        const { data } = await followUserApi(`/article/followUser/${user.id}`, user.id)
        if (data.value?.code == 0) {
            showSuccessToast("关注成功");
            if (!user.relations) user.relations = {}
            user.relations.isSubscribed = true
        }
    } finally {
        followLoading.value = false
    }
}
/* 取消关注 */
async function unfollowUser(user?: User | null) {
    if (!user || followLoading.value) return;
    followLoading.value = true

    try {
        const { data } = await unfollowUserApi(`/article/followUser/${user.id}`, user.id)
        if (data.value?.code == 0) {
            showSuccessToast("取关成功");
            if (user.relations) user.relations.isSubscribed = false
        }
    } finally {
        followLoading.value = false
    }
}
/* 渲染评论框 */
function ShowModel(e?: Comment | number | string, isShowVote = false) {
    if (!logged.value.login) { showFailToast("请先登录"); return; }
    if (!e) return;
    if (typeof e !== "object") {
        selectComment.postId = e
        selectComment.id = null;
    } else {
        selectComment.id = e.id
    }
    showVote.value = isShowVote
    selectComment.show = true
}
/* 评论成功的回调 */
function commentSuccess(user: User[], comment: Comment, monfDetalis?: MonfVoteDetail[]) {
    getUserMap([...user], users);
    if (Array.isArray(monfDetalis)) {
        monfDetalis.forEach(e => {
            scores.value.set(e.id, e)
        })

    }
    if (typeof comment.relations?.parentCommentId === "number") {
        const flag = comments.value.get(comment.relations?.parentCommentId)
        if (!flag) return;
        if (!Array.isArray(flag?.children)) flag.children = [];
        flag?.children.push(comment)
    } else if (comment && !comment.relations) {
        comments.value.set(comment.id, comment)
    }
}
/* 点赞 */
async function like_this() {
    try {
        if (!article.value) return;
        if (!logged.value.login) {
            showFailToast("请先登录");
            return;
        }
        let isLike = article.value.relations.isLiked;
        if (isLike === false) isLike = undefined;
        const { data, error, refresh, execute } = await like(`article/like/${article.value.id}`, article.value.id, isLike);
        if (data.value?.code === 0) {
            const sum = isLike ? -1 : 1
            showSuccessToast(isLike ? "取消点赞" : "点赞成功");
            article.value.likeCount += sum;
            article.value.relations.isLiked = !isLike;
        }

    } catch (error) {
        if (error instanceof Error) {
            showFailToast(error.message)
        }
    }
}

provide<ArticlePageAPI>("ArticlePage", {
    setMoveDetali(id, value) {
        scores.value.set(id, value)
    }
})


function getColor() {
    return `#${Math.random().toString(16).substr(-6)}`
}




</script>
<style lang="scss" scoped>
.postCatalog {
    font-size: 14px;
}

@media screen and (max-width: 1170px) {

    .mainPage {
        max-width: 100vw;
    }
}

.mainPage {
    flex: 1;
    width: 100%;
}

.mainPage {
    max-width: 770px;
}

.commentCard {
    padding: 28px 40px 0px;
    border-radius: 8px 8px 0px 0px;
    color: var(--mug-text);
    background-color: var(--mug-card-bg);
    position: relative;
    margin-top: 16px;

    .commentCard_header {
        margin-bottom: 24px;

        h3 {
            font-size: 22px;
            font-weight: 500;
        }
    }


}

.myVote {
    margin-bottom: 12px;
    border-radius: 8px;

    h3 {
        font-size: 22px;
        font-weight: 500;
    }
}

.cardFooter {
    position: sticky;
    width: 100%;
    bottom: 0;
    top: 0;
    min-height: 60px;
    background-color: var(--mug-card-bg);
    padding: 16px;
    border-radius: 0px 0px 8px 8px;
    box-shadow: 0px -30px 53px -24px rgba(0, 0, 0, 0.25);

    .iconSum {
        font-size: 12px;
        font-weight: 500;
        color: var(--mug-sub-text);
        margin-top: 3px;
    }

    .openInput {
        flex: 1;
        background-color: #F5F5F5;
        border-radius: 12px;
        padding: 11px;
        padding-left: 18px;
        font-size: 14px;
        color: var(--mug-sub-text);
        margin-right: 20px;
        cursor: pointer;
    }
}

.commentIconBox,
.likeIconBox {
    width: 50px;
    height: 100%;
    cursor: pointer;
    align-items: center;
}

.monfVote {
    margin: 16px;
    width: 50%;
}

.newcardBody {
    padding-bottom: 36px;
    margin-top: -10px;
    border-radius: 8px;
    color: var(--mug-text);
    position: relative;
    z-index: 10;

    .newcardBodyRight {
        margin-left: 16px;
    }

    // backdrop-filter: blur(3px);
    h5 {
        color: var(--mug-text);
        font-size: 18px;
        font-weight: 500;
        margin-top: 10px;
    }

    .userSub {
        position: absolute;
        right: 22px;
        color: var(--mug-sub-text);
        bottom: 12px;
        font-size: 12px;
    }

    .userDetali {
        margin-top: 10px;

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
}

.newcard {
    border-radius: 8px;
    position: relative;
    margin-bottom: 12px;
    overflow: hidden;
    background-color: var(--mug-card-bg);

    h3 {
        color: var(--mug-text);
        font-weight: 400;
        font-size: 20px;
        padding-bottom: 14px;
        border-bottom: 1px solid #ccc;
        margin-bottom: 23px;
    }

    .newCardUserBg {
        width: 100%;
        height: 133px;
        max-height: 133px;
        display: flex;
        align-items: center;
        overflow: hidden;

        img {
            object-fit: cover;
            width: 100%;
            max-height: 50%;
        }
    }

}

@media screen and (max-width: 768px) {
    .card {
        padding: 26px 20px 0px !important;
    }

    .articleContent {
        padding: 0 !important;
    }

    .title {
        font-size: 22px !important;
        margin: 20px 0px 14px !important;
    }

    .commentCard {
        padding: 24px 24px 0 !important;
    }
}

.card {
    padding: 36px 40px 0px;
    border-radius: 8px;
    color: var(--mug-text);
    background-color: var(--mug-card-bg);
    position: relative;



    .nickName {
        margin-left: 18px;
    }

    .createTime {
        font-size: 12px;
        margin-top: 6px;
        color: var(--mug-sub-text);
    }

    .title {
        font-size: 24px;
        font-weight: 500;
        line-height: 38px;
        margin: 20px 0px 24px;
        color: var(--mug-text);
    }

    .commentIconBox {
        margin-right: 34px;
    }



    .likeUsers {
        padding: 20px 0px;

        .likeUsersElement {
            display: grid;
            grid-template-columns: repeat(5, 32px);
            column-gap: 14px;
            row-gap: 4px;
        }

        span {
            font-size: 14px;
            margin-bottom: 12px;
            color: var(--mug-sub-text);
        }
    }

    .lockUser {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-size: 12px;
        color: var(--mug-sub-text);
        margin: 30px 0px 50px;
    }
}

.articleContent {
    font-size: 12px;
    font-weight: 500;
    font-family: 'AlibabaPuHuiTi-2-45-Light';
    line-height: 26px;
    padding: 0 14px;

    :deep(p, ul, ol, blockquote) {
        margin-bottom: 1em;
    }
}

.moreMenu {
    margin-left: 12px;
    cursor: pointer;
    padding-top: 2px;
}

.selectComment {
    font-size: 13px;
    color: var(--mug-sub-text);
    display: flex;
    align-items: center;
    cursor: pointer;

    .CommentTypeActive {
        color: var(--mug-text);
    }

    li {
        padding: 4px 6px;
    }

    .diviving {
        padding: 0 !important;
        background-color: var(--mug-dividing);
        margin: 0 6px;
        width: 1px;
        height: 50%;
    }
}

.attention {
    margin-left: auto;
    height: 100%;

    button {
        height: 32px;
    }
}

.isliked {
    transform: translateY(-2px);
}

.bio {
    color: var(--mug-sub-text);
    font-size: 12px;
    margin-top: 5px;
    display: block;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.monfVoteInfo-card {
    padding: 3px 0;

    span {
        width: 70px;
    }
}

.userHeader {
    height: 62px;
    width: 62px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
}
</style>
