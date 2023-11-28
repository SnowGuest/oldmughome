<template>

    <ul>
        <li v-for="[id, item] in comments" class="comment" v-show="!item.isHidden" :key="item.id">
            <RouterLink target="_blank" :to="`/account/${getUser(item.createdUserId)?.id}`" style="min-width: 50px;">
                <n-avatar lazy round :size="50" :src="getUser(item.createdUserId)?.avatarUrl">
                </n-avatar>
            </RouterLink>
            <div class="commentBody">
                <div class="flex items-center justify-between">
                    <RouterLink target="_blank" :to="`/account/${getUser(item.createdUserId)?.id}`">
                        <h4 class="nickName">{{ getUser(item.createdUserId)?.nickName }}</h4>
                        <h5 class="desu">{{ getUser(item.createdUserId)?.bio }}</h5>
                    </RouterLink>
                    <div class="justify-center flex items-center commentLike" @click="likeComment(item)">
                        <span class="likeCount">{{ item.likeCount }}</span>

                        <box-icon v-show="!item.relations?.isLiked" name='heart' />
                        <box-icon v-show="item.relations?.isLiked" name='heart' type='solid' color='#fb0101' />

                    </div>
                </div>



                <div class="commentContent">{{ item.content }}</div>

                <div class="commentControl flex items-center" :id="`commentControl${item.id}`">
                    <time class="time">发布于 {{ getCreateTime(item.createdDate) }}</time>
                    <span @click="tapBack(item)" class="commentBack">回复</span>
                </div>
                <ul>
                    <li v-for="child in item.children" :key="child.id" class="commentChildBody">
                        <RouterLink class="flex items-center" target="_blank"
                            :to="`/account/${getUser(child.createdUserId)?.id}`" style="min-width: 30px;">
                            <n-avatar round :size="30" :src="getUser(child.createdUserId)?.avatarUrl">
                            </n-avatar>
                        </RouterLink>
                        <div style="flex:1">
                            <div class="flex items-center justify-between">
                                <RouterLink target="_blank" :to="`/account/${getUser(child.createdUserId)?.id}`">
                                    <h4 class="nickName-child">{{ getUser(child.createdUserId)?.nickName }}</h4>
                                </RouterLink>
                                <div class="justify-center flex items-center commentLike" @click="likeComment(child)">
                                    <span class="likeCount">{{ child.likeCount }}</span>
                                    <box-icon v-show="!child.relations?.isLiked" name='heart' />
                                    <box-icon v-show="child.relations?.isLiked" name='heart' type='solid' color='#fb0101' />


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

    <n-empty class="p-t-10 p-b-10" v-if="status === 'zero'" description="暂无评论" />
    <span class="endtext" v-if="status === 'end'">没有更多了</span>

    <span class="endtext" v-if="status === 'loading'">加载中</span>

    <n-empty class="p-t-10 p-b-10" image="error" v-if="status === 'netword'" description="加载失败" />
    <span class="endtext" v-if="status === 'netword' && comments.size <= 0">加载失败</span>
</template>

<script lang="tsx" setup >
import dayjs from "dayjs/esm";
import { commentLike } from "@/api/comment";
import type { Comment } from '@/api/post';
import type { User } from '@/api/user';
import type { CommentStatus } from "@/pages/article/index.vue";
import { useMessage } from "naive-ui";
import { useApiToPaginationInstance } from "@/utils";

interface Prop {
    users?: Map<number, User>;
    comments: Map<Comment["id"], Comment>;
    status: useApiToPaginationInstance["status"]["value"];
}




const props = defineProps<Prop>();


function getUser(id: number) {
    return props.users?.get(id)
}
function getCreateTime(time: string) {
    console.log(dayjs.locale("zh-cn"))
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
const message = useMessage()


async function likeComment(comment: Comment) {
    let isLike = comment.relations?.isLiked;
    if (isLike === false) isLike = undefined;
    const { code } = await commentLike(comment.id, isLike);
    if (code === 0) {
        const sum = isLike ? -1 : 1;
        if (!comment.relations) comment.relations = {}
        comment.relations.isLiked = !isLike;
        message.success(isLike ? "取消点赞" : "点赞成功");
        comment.likeCount += sum
    }
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

.endtext {
    color: #ccc;
    font-size: 12px;
    text-align: center;
    padding: 14px 0 20px;
}
</style>
