<template>
    <div class="commentCard flex column">
        <div class="flex justify-between commentCard_header">
            <h3>全部评论</h3>
            <ol class="selectComment">
                <li @click="setCommentType(ArticleSortField.LikeCount)"
                    :class="{ CommentTypeActive: searchParams.sortField === ArticleSortField.LikeCount }">热门</li>
                <li class="diviving"></li>
                <li @click="setCommentType(ArticleSortField.createdDate)"
                    :class="{ CommentTypeActive: searchParams.sortField === ArticleSortField.createdDate }">最新</li>
            </ol>
        </div>

        <li v-for="[id, item] in comments" class="comment" v-show="!item.isHidden" :key="item.id">
            <RouterLink target="_blank" :to="`/account/${getUser(item.createdUserId)?.id}`" style="min-width: 50px;">
                <userCard :user="getUser(item.createdUserId)" :size="50" />
            </RouterLink>
            <div class="commentBody">
                <div class="flex items-center justify-between">
                    <RouterLink target="_blank" :to="`/account/${getUser(item.createdUserId)?.id}`">
                        <h4 class="nickName">{{ getUser(item.createdUserId)?.nickName }}</h4>
                        <h5 class="desu">{{ getUser(item.createdUserId)?.bio }}</h5>
                    </RouterLink>
                    <div class="flex justify-center items-center commentLike" @click="likeComment(item)">
                        <span class="likeCount">{{ item.likeCount }}</span>
                        <box-icon v-show="item.relations?.isLiked" name='heart'></box-icon>
                        <box-icon v-show="!item.relations?.isLiked" name='heart' type='solid' color='#fb0101'></box-icon>

                    </div>
                </div>
                <CommentVote @updateComment="e => updateComment(item, e)" v-if="showVote(item)" :commentId="item.id"
                    :vote="item" />
                <div class="commentContent">{{ item.comment }}</div>

                <div class="commentControl flex items-center" :id="`commentControl${item.id}`">
                    <time class="time">发布于 {{ getCreateTime(item.createdDate) }}</time>
                </div>

            </div>

        </li>

    </div>
    <ShowComment :commentId="commentId" :update="editMonf" :myWorkId="myWorkId" :monfId="id" v-model:show="showComment"
        @success="putComment">
    </ShowComment>
</template>

<script lang="tsx" setup >
import ShowComment from "@/components/monf/monfShowComment.vue"
import CommentVote from "./monfCommentVote.vue"
import dayjs from "dayjs";
import { ArticleSortField, type GetArticleParams } from '@/api/post';
import { type Monf2023CommentsBody, type MonfComment, monfCommentLike, monfunCommentLike } from '@/api/monf';
import { getMonf2023Comment } from "@/api/monf";
import type { User } from "@/api/user";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import { getUserMap, useApiToPagination } from "@/utils";
import { ref, reactive } from "vue";
import { useMessage } from "naive-ui";
import type { InstanceBody } from "@/utils/request";
import userCard from "../userCard.vue"
export interface MonfCommentAPI {
    show: () => void;
    next: () => void;
}
const message = useMessage()
function showVote(comment: MonfComment) {
    return typeof comment.chartScore === 'number' || typeof comment.musicScore === 'number'
}
interface Prop {
    id: number | string;
    myWorkId?: number;
    editMonf: boolean;
}
const emits = defineEmits<{
    (event: 'setMonfId', id: number): void
}>()
const commentId = ref<number>()
const showComment = ref(false)
defineExpose<MonfCommentAPI>({
    show() {
        showComment.value = true
    },
    next() {
        commitPagination.next()
    }
})
const props = defineProps<Prop>();
const users = new Map<User["id"], User>()
const searchParams = reactive<GetArticleParams>({
    sortField: ArticleSortField.createdDate,
    sortType: "asc",
    id: props.id,
    page: 1,
    pageSize: 10
});

function loadComment() {
    return useApiToPagination<MonfComment, InstanceBody<Monf2023CommentsBody>, "id">(getMonf2023Comment, searchParams, "id", ({ data: { workComments, includes } }) => {
        getUserMap(includes.users, users);
        return workComments
    });
}


const commitPagination = loadComment()
const { list: comments } = commitPagination
function getUser(id: number) {
    return users.get(id)
}
function getCreateTime(time: string) {
    return dayjs(dayjs()).diff(time, "hour") > 12 ? dayjs(time).format("YYYY/MM/DD HH:mm") : dayjs(time).fromNow();
}
function comment(e: MonfComment) {
    commentId.value = e.id;
    showComment.value = true
}

async function putComment(user: User[], comment: MonfComment) {
    getUserMap([...user], users);
    if (typeof comment.relations?.parentCommentId === "number") {
        const flag = comments.value.get(comment.relations?.parentCommentId)
        if (!flag) return;
        if (!Array.isArray(flag?.children)) flag.children = [];
        flag?.children.push(comment)
    } else if (comment && !comment.relations) {
        comments.value.set(comment.id, comment)
    }
    emits("setMonfId", comment.id)
}


const { logged } = storeToRefs(useUserStore())
async function likeComment(comment: MonfComment) {
    if (!logged.value.login) {
        message.warning("请先登录"); return;
    }
    let isLike = Boolean(comment.relations?.isLiked)
    console.log(isLike)
    const { code } = await (isLike ? monfunCommentLike : monfCommentLike)(comment.id);
    if (code === 0) {
        const sum = isLike ? -1 : 1;
        if (!comment.relations) comment.relations = {}
        comment.relations.isLiked = !isLike
        message.success(isLike ? "取消点赞" : "点赞成功");
        comment.likeCount += sum
    }
}


async function setCommentType(e: ArticleSortField) {
    searchParams.sortField = e;

    commitPagination.reload()
}
function updateComment(newComment: MonfComment, oldComment: MonfComment) {
    Object.assign(newComment, oldComment)
}
</script>
<style lang="scss" scoped>
.comment {
    margin-bottom: 20px !important;
}

.comment,
.commentChildBody {
    display: flex;
    align-items: flex-start;
    margin-bottom: 30px;
}

.commentChildBody:last-child {
    margin-bottom: 0;
}

.commentBody {
    width: 100%;
    margin-left: 14px;
    padding-top: 10px;
}

.commentContent {
    margin-top: 12px;
    font-size: 16px;
    font-weight: 500;
    // font-family: 'AlibabaPuHuiTi-2-45-Light';
    line-height: 24px;
    padding: 0 14px;
}

.nickName,
.nickName-child {
    color: var(--mug-text);
    font-size: 18px;
    // margin-bottom: 12px;
    font-weight: 500;
}

.nickName-child {
    font-size: 17px;
    margin-bottom: 0px;
    margin-left: 16px;
}

.commentControlChild {
    margin-bottom: 0px !important;
}

.commentControl {
    color: var(--mug-sub-text);
    font-size: 13px;
    margin: 16px 0 14px;
    display: flex;

    .time {
        margin-right: 12px;
    }

    .commentBack {
        cursor: pointer;
    }


}

.commentLike {
    cursor: pointer;

    .likeCount {
        color: var(--mug-sub-text);
        margin-right: 4px;
    }
}

.isLiked {
    transform: translateY(-2px);
}

.desu {
    font-weight: 500;
    font-size: 12px;
    margin-top: 4px;
    color: var(--mug-sub-text);
    width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}


@media screen and (max-width: 1240px) {
    .commentCard {
        padding: 21px 20px 0px !important;
    }
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
