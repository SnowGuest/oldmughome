<template>
    <!-- <List v-model:loading="status.loading" :finished="status.finished" :immediate-check="false" @load="load_comment"> -->
    <ul>
        <li v-for="[id, item] in comments" class="comment" v-show="!item.isHidden" :key="item.id">
            <NuxtLink target="_blank" :to="`/account/${getUser(item.createdUserId)?.id}`" style="min-width: 50px;">
                <Image round width="50" height="50" :src="getUser(item.createdUserId)?.avatarUrl">
                </Image>
            </NuxtLink>
            <div class="commentBody">
                <div class="flex items-center justify-between">
                    <NuxtLink target="_blank" :to="`/account/${getUser(item.createdUserId)?.id}`">
                        <h4 class="nickName">{{ getUser(item.createdUserId)?.nickName }}</h4>
                        <h5 class="desu">{{ getUser(item.createdUserId)?.bio }}</h5>
                    </NuxtLink>
                    <div class="justify-center flex items-center commentLike" @click="likeComment(item)">
                        <span class="likeCount">{{ item.likeCount }}</span>
                        <Icon :class="{ isLiked: item.relations?.isLiked }"
                            :name="item.relations?.isLiked ? 'flat-color-icons:like' : 'ci:heart-outline'" />
                    </div>
                </div>



                <div class="commentContent">{{ item.content }}</div>

                <div class="commentControl items-center" :id="`commentControl${item.id}`">
                    <time class="time">发布于 {{ getCreateTime(item.createdDate) }}</time>
                    <span @click="tapBack(item)" class="commentBack">回复</span>
                </div>
                <ul>
                    <li v-for="child in item.children" :key="child.id" class="commentChildBody">
                        <NuxtLink class="items-center" target="_blank" :to="`/account/${getUser(child.createdUserId)?.id}`"
                            style="min-width: 30px;">
                            <Image round width="30" height="30" :src="getUser(child.createdUserId)?.avatarUrl">
                            </Image>
                        </NuxtLink>
                        <div style="flex:1">
                            <div class="items-center justify-between">
                                <NuxtLink target="_blank" :to="`/account/${getUser(child.createdUserId)?.id}`">
                                    <h4 class="nickName-child">{{ getUser(child.createdUserId)?.nickName }}</h4>
                                </NuxtLink>
                                <div class="justify-center flex items-center commentLike" @click="likeComment(child)">
                                    <span class="likeCount">{{ child.likeCount }}</span>
                                    <Icon :class="{ isLiked: child.relations?.isLiked }"
                                        :name="child.relations?.isLiked ? 'flat-color-icons:like' : 'ci:heart-outline'" />
                                </div>
                            </div>
                            <div class="commentContent">{{ child.content }}</div>
                            <div class="commentControl commentControlChild items-center">
                                <time class="time">发布于 {{ getCreateTime(child.createdDate) }}</time>
                                <!-- <span @click="tapBack(child)" class="commentBack">回复</span> -->
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

        </li>

    </ul>
    <!-- <template #finished>
            <Empty v-if="comments.size <= 0" description="暂无评论" />
            <span v-else="comments.size > 0">没有更多了</span>
        </template>
        <template #loading>
            <Empty v-if="comments.size <= 0" image="search" description="加载中" />
            <span v-else="comments.size > 0">加载中</span>
        </template>
        <template #error>
            <Empty image="error" v-if="comments.size <= 0" description="加载失败" />
            <span v-else="comments.size > 0">加载失败</span>
        </template> -->
    <!-- </List> -->
</template>

<script lang="tsx" setup >
import dayjs from "dayjs";
import { Image, Empty, showSuccessToast, showFailToast } from "vant"
import { commentLike } from "@/api/comment";
import { Comment, MonfVoteDetail } from '@/api/post';
import { User } from '@/api/user';
import { List } from "vant"
import { CommentStatus } from "@/pages/article/[id].vue";

interface Prop {
    users?: Map<number, User>;
    comments: Map<Comment["id"], Comment>;
    next: () => Promise<boolean>;
    status: CommentStatus;
    scores: Map<number, MonfVoteDetail>;
}




const props = defineProps<Prop>();
console.log(props.scores, '分数')


function getUser(id: number) {
    return props.users?.get(id)
}
function getCreateTime(time: string) {
    return dayjs(dayjs()).diff(time, "hour") > 12 ? dayjs(time).format("YYYY/MM/DD HH:mm") : dayjs(time).fromNow();
}
interface Emit {
    (event: 'comment', e: Comment): void;
    (event: 'update:comment', e: CommentStatus): void;

}
const emit = defineEmits<Emit>()
function tapBack(e: Comment) {
    emit("comment", e)
}


async function likeComment(comment: Comment) {
    try {
        let isLike = comment.relations?.isLiked;
        if (isLike === false) isLike = undefined;
        const { data, error, refresh, execute } = await commentLike(`index/like/${comment.id}`, comment.id, isLike);
        if (data.value?.code === 0) {
            const sum = isLike ? -1 : 1;
            if (!comment.relations) comment.relations = {}
            comment.relations.isLiked = !isLike
            showSuccessToast(isLike ? "取消点赞" : "点赞成功");
            comment.likeCount += sum
        }

    } catch (error) {
        if (error instanceof Error) {
            showFailToast(error.message)
        }
    }
}

async function load_comment() {
    await props.next()

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
</style>
