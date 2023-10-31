
<template>
    <ScrollView @load="() => commentRefs?.next()">
        <div class="mainPage-body flex justify-center">
            <div class="mainPage">
                <div class="card flex column" id="card">
                    <div class="flex items-center">
                        <RouterLink :to="`/account/${user?.id}`" target="_blank">
                            <userCard :user="user" :size="62" />
                        </RouterLink>
                        <div class="items-center justify-center flex ">
                            <div class="nickName flex  column">
                                <span>{{ user?.nickName }}</span>
                                <time class="createTime"> 发布于 {{ createTime }}</time>
                            </div>
                        </div>
                        <div class="attention flex items-center">
                            <n-button round @click="like">
                                <div class="flex items-center">
                                    <box-icon v-show="monf?.relations?.isLiked" name='heart'></box-icon>
                                    <box-icon v-show="!monf?.relations?.isLiked" name='heart' type='solid'
                                        color='#fb0101'></box-icon>

                                    <span class="ml-1">{{ monf?.relations?.isLiked ? "取消点赞" : "点赞" }}({{ monf?.likeCount
                                    }})</span>
                                </div>
                            </n-button>
                            <div class="w-3"></div>
                            <n-button v-if="!user?.relations?.isSubscribed" type="primary" round :loading="followLoading"
                                @click="followUser(user)">关注</n-button>
                            <n-button v-else round :loading="followLoading" @click="unfollowUser(user)">取消关注</n-button>
                        </div>
                    </div>
                    <h2 class="title">【MONF2023】{{ monf?.songName }} - {{ monf?.teamName }}</h2>
                    <div class="flex flex-col">
                        <h3>队员:</h3>
                        <n-data-table
                            :columns="[{ title: '名称', key: 'memberName' }, { title: '职位', key: 'memberJob' }, { title: 'Malody UID', key: 'memberMalodyUID' }]"
                            :data="monf?.members" style="width:50%;" class="mt-5 mb-5" />
                        <div v-if="sidString">
                            <h3>作品SID:</h3>
                            <a target="_blank" :href="`https://m.mugzone.net/song/${monf?.malodySID}`">
                                <n-button quaternary type="info"> {{ sidString }} </n-button>
                            </a>
                        </div>
                        <h3>简介:</h3>
                        <p style="margin-top: 5px; margin-bottom: 5px;">{{ monf?.intro }}</p>
                        <h3 style="margin-top: 8px;">预览视频：</h3>
                        <mug-bilibili class="w-[80%] mt-10 ml-a mr-a" :bvid="monf?.bilibiliLink" />
                    </div>


                    <div class="lockUser " id="comments" ref="commentsDom">
                        <Popover :actions="actions" @select="selectMonfMenu">
                            <template #reference>
                                <box-icon name='dots-horizontal-rounded' class="moreMenu"></box-icon>
                            </template>
                        </Popover>
                    </div>
                </div>
                <div class="newcard newcard2" style="padding:16px">
                    <h3>作品评价</h3>
                    <div class="monfVoteInfo-card"> <span>平均分：</span>
                        <p v-if="monf">{{ (monf?.chartScoreAvg + monf?.musicScoreAvg).toFixed(2) }}</p>
                    </div>
                    <div class="monfVoteInfo-card"> <span>总分：</span>
                        <p v-if="monf">{{ monf?.chartScoreTotal + monf?.musicScoreTotal }}</p>
                    </div>
                    <div class="monfVoteInfo-card"> <span>谱面平均分：</span>
                        <p>{{ monf?.chartScoreAvg.toFixed(2) }}</p>
                    </div>
                    <div class="monfVoteInfo-card"> <span>谱面总分：</span>
                        <p>{{ monf?.chartScoreTotal }}</p>
                    </div>
                    <div class="monfVoteInfo-card"> <span>谱面打分人数：</span>
                        <p>{{ monf?.chartScoreCount }}</p>
                    </div>
                    <div class="monfVoteInfo-card"> <span>音乐平均分：</span>
                        <p>{{ monf?.musicScoreAvg.toFixed(2) }}</p>
                    </div>
                    <div class="monfVoteInfo-card"> <span>音乐总分：</span>
                        <p>{{ monf?.musicScoreTotal }}</p>
                    </div>
                    <div class="monfVoteInfo-card"> <span>音乐打分人数：</span>
                        <p>{{ monf?.musicScoreCount }}</p>
                    </div>
                    <n-button @click="ShowModel" class="monfVote" type="success" block>{{ monf?.relations?.scoredCommentId ?
                        "重新打分" : "打分" }}/评论</n-button>
                </div>
                <MonfComment @setMonfId="setMonfId" ref="commentRefs" :myWorkId="monf?.relations?.scoredCommentId"
                    :editMonf="editMonf" :id="id"></MonfComment>

            </div>

            <SideBar :tag="false" :check="false">
                <div class="newcard ">
                    <div class="newCardUserBg">
                        <background :src="user?.userCoverUrl" />
                    </div>
                    <div class="newcardBody flex column items-center justify-center">
                        <div class="flex items-center">
                            <RouterLink target="_blank" :to="`/account/${user?.id}`">
                                <userCard :user="user" :size="62" />
                            </RouterLink>
                            <div class="newcardBodyRight">
                                <h5>{{ user?.nickName }}</h5>
                                <span class="bio">{{ user?.bio || "这位用户没有简介哦~" }}</span>
                            </div>
                        </div>

                        <ul class="flex items-center userDetali">
                            <li class="column flex items-center justify-center">
                                <span class="sum">{{ user?.postCount || 0 }}</span>
                                <span class="sumText">帖子</span>
                            </li>
                            <li class="column flex items-center justify-center">
                                <span class="sum"> {{ user?.followerCount || 0 }}</span>
                                <span class="sumText">粉丝</span>
                            </li>
                        </ul>

                        <div class="userSub">已经加入音游窝{{ userJoinDay }}天</div>
                    </div>
                </div>
                <div class="newcard" style="padding:16px">
                    <h3>作品评价</h3>
                    <div class="monfVoteInfo-card"> <span>平均分：</span>
                        <p v-if="monf">{{ (monf?.chartScoreAvg + monf?.musicScoreAvg).toFixed(2) }}</p>
                    </div>
                    <div class="monfVoteInfo-card"> <span>总分：</span>
                        <p v-if="monf">{{ monf?.chartScoreTotal + monf?.musicScoreTotal }}</p>
                    </div>
                    <div class="monfVoteInfo-card"> <span>谱面平均分：</span>
                        <p>{{ monf?.chartScoreAvg.toFixed(2) }}</p>
                    </div>
                    <div class="monfVoteInfo-card"> <span>谱面总分：</span>
                        <p>{{ monf?.chartScoreTotal }}</p>
                    </div>
                    <div class="monfVoteInfo-card"> <span>谱面打分人数：</span>
                        <p>{{ monf?.chartScoreCount }}</p>
                    </div>
                    <div class="monfVoteInfo-card"> <span>音乐平均分：</span>
                        <p>{{ monf?.musicScoreAvg.toFixed(2) }}</p>
                    </div>
                    <div class="monfVoteInfo-card"> <span>音乐总分：</span>
                        <p>{{ monf?.musicScoreTotal }}</p>
                    </div>
                    <div class="monfVoteInfo-card"> <span>音乐打分人数：</span>
                        <p>{{ monf?.musicScoreCount }}</p>
                    </div>
                    <n-button @click="ShowModel" class="monfVote" type="success" block>{{ monf?.relations?.scoredCommentId ?
                        "重新打分" : "打分" }}/评论</n-button>
                </div>
            </SideBar>
        </div>
    </ScrollView>
</template>

<script lang="ts" setup>
import ScrollView from "@/components/scrollview/scrollView.vue"
import { NButton, NDataTable, useMessage } from "naive-ui"
import MonfComment, { type MonfCommentAPI } from "@/components/monf/monfComment.vue"
import userCard from "@/components/userCard.vue"

import { getMonf2023, monfLike, monfunLike, type Monf } from '@/api/monf';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import { followUserApi, unfollowUserApi, type User } from '@/api/user';
import dayjs from 'dayjs';
// import { showSuccessToast } from 'vant';
// import { CommentStatus, SelectComment } from '@/components/article/preload';
// import { ArticleSortField, GetArticleParams, MonfVoteDetail } from "@/api/post";
import { getUserMap } from "@/utils";
// import { useHead } from "@unhead/vue";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
// import { Popover } from "vant"
const userInfo = useUserStore()
const actions = computed(() => {
    const arr = [];
    if (monf.value && monf.value?.createdUserId === userInfo.userInfo?.id) {
        arr.push({ text: "编辑" })
    }
    return arr
})
const message = useMessage()
const commentRefs = ref<MonfCommentAPI>()


/* 关注用户  */
async function followUser(user?: User | null) {
    if (!logged.value.login) {


        message.warning("请先登录"); return;
    }

    if (!user || followLoading.value) return;
    followLoading.value = true

    try {
        const { code } = await followUserApi(user.id)
        if (code == 0) {
            message.success("关注成功");
            if (!user.relations) user.relations = {}
            user.relations.isSubscribed = true
        }
    } finally {
        followLoading.value = false
    }
}
/* 取消关注 */
async function unfollowUser(user?: User | null) {
    if (!logged.value.login) { message.warning("请先登录"); return; }
    if (!user || followLoading.value) return;
    followLoading.value = true

    try {
        const { code } = await unfollowUserApi(user.id)
        if (code == 0) {
            message.success("取关成功");
            if (user.relations) user.relations.isSubscribed = false
        }
    } finally {
        followLoading.value = false
    }
}
function ShowModel() {
    if (!logged.value.login) { message.warning("请先登录"); return; }
    commentRefs.value?.show()
}

const followLoading = ref(false)
function loadMonf(id: string) {
    const monf = ref<Monf>()
    const users = new Map<User["id"], User>()
    const user = ref<User>()
    const createTime = ref("")
    const userJoinDay = ref(0)
    const editMonf = ref(false);
    const sidString = ref("-")
    getMonf2023(id).then(({ data: { work, includes } }) => {
        monf.value = work;
        document.title = `${work.songName} - ${work.teamName}`;
        sidString.value = "s" + work.malodySID.toString();
        getUserMap(includes.users, users);
        user.value = users.get(work.createdUserId);
        createTime.value = dayjs(work.createdDate).format("YYYY-MM-DD HH:mm")
        userJoinDay.value = dayjs().diff(dayjs(user.value?.createdDate), 'day');
        if (!work.relations) work.relations = {}
        if (typeof work.relations?.scoredCommentId === "number") {
            editMonf.value = true
        }
        if (!("isLiked" in work.relations)) {
            work.relations.isLiked = false
        }
    })

    return { monf, users, user, createTime, userJoinDay, editMonf, sidString }
}


const { logged } = storeToRefs(useUserStore())
const route = useRoute();
const id = typeof route.params.id === "string" ? route.params.id : null;
if (!id) throw new Error("此帖子不存在或已被删除");
const { monf, user, createTime, userJoinDay, editMonf, sidString } = loadMonf(id);

async function like() {
    if (!monf.value) return;
    let isLike = Boolean(monf.value.relations?.isLiked)
    const { data, code } = await (isLike ? monfunLike : monfLike)(monf.value.id);
    if (code === 0) {
        const sum = isLike ? -1 : 1;
        if (!monf.value.relations) monf.value.relations = {}
        monf.value.relations.isLiked = !isLike
        message.success(isLike ? "取消点赞" : "点赞成功");
        monf.value.likeCount += sum
    }
}
function selectMonfMenu(e: typeof actions["value"][number]) {
    if (e.text === "编辑") {
        window.open(router.resolve({
            path: `/compile/monf/${id}`
        }).href, "_blank")

    }
}

function setMonfId(e: number) {
    if (!monf.value) return
    if (!monf.value.relations) {
        monf.value.relations = {}
    }

    Object.assign(monf.value.relations, {
        scoredCommentId: e
    })
    editMonf.value = true;
    console.log("触发完毕")
}

</script>
<style lang="scss" scoped>
.newcard2 {
    display: none;
    margin-top: 12px;

    h3 {
        border: none !important;
    }
}


@media screen and (max-width: 1240px) {
    .newcard2 {
        display: block;
    }
}


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

.mainPage-body {
    padding-top: 16px;
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
    margin: 16px auto;
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

.isLike {
    transform: translateY(-2px);
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
    margin: auto;
    width: fit-content;

    span {
        display: inline-block;
        width: 100px;
        font-weight: bold;
    }

    p {
        display: inline-block;
        width: 70px;
    }
}

// .userHeader {
//     height: 62px;
//     width: 62px;
//     border-radius: 50%;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     font-size: 28px;
// }
</style>