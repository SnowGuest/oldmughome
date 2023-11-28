import { getArticle, like, ArticleSortField } from "@/api/post";
import type { GetArticleParams, MonfVoteDetail, MonfVote, Article, ArticleBody } from "@/api/post";
import type { User } from "@/api/user";
import type { Comment } from "@/api/post"
// import { showFailToast, showSuccessToast } from "vant";
import { useUserStore } from "@/stores/user";
import { getUserMap, useApiToPagination } from "@/utils";
import { reactive, type Ref, ref } from "vue";
import type { InstanceBody } from "@/utils/request";
import dayjs from "dayjs/esm";

/** 评论列表状态 */
export interface CommentStatus {
    /** 是否已结束 */
    finished: boolean,
    /** 是否在加载中 */
    loading: boolean,
}
/** 选择列表项的类型 */
export interface SelectComment {
    show: boolean,
    postId: null | string | number,
    id: null | string | number,
}
export function getArticleInfo(id: number | string, searchParams: GetArticleParams) {
    const article = ref<Article | undefined>(undefined);
    const userJoinDay = ref(0);
    const likeUsers = ref<Map<number, User>>(new Map());
    const scores = ref<Map<number, MonfVoteDetail>>(new Map());
    const monfVoteInfo = ref<MonfVote | undefined>(undefined);
    // const comments = ref<Map<number, Comment>>(new Map());
    const users = new Map<number, User>();
    const isVote = ref(false);
    const myMonfVote = ref<MonfVoteDetail>();
    const user = ref<User | undefined>(undefined);
    getArticle({ ...searchParams, id }).then(({ data: { post, includes, } }) => {
        article.value = post;
        // const body = {
        /** 所有点赞的人的信息 */
        // const likeUsers = new Map<number, User>();
        /** 所有人的打分信息 */
        // const scoreMap = new Map<number, MonfVoteDetail>();
        // let monfVoteInfo: MonfVote | undefined = undefined;
        /** 评论map */
        // const comments = new Map<number, Comment>();
        /** 是否是可打分的 */
        getUserMap(includes.users, users);
        // const commentMap = includes.comments;
        user.value = users.get(post.createdUserId);
        if (user.value) userJoinDay.value = dayjs().diff(dayjs(user.value.createdDate), 'day')
        document.title = `${post.title} - MUGHome`

        const monfVoteDetails = includes.monfVoteDetails;
        const monfVoteInfos = includes.monfVoteInfos;
        const postLikeUserId = post.relations.postLikeUserId;
        const MONFVoted = post.relations.MONFVoted;
        const MONFVoteId = post.relations.MONFDetailVotedId;

        if (Array.isArray(monfVoteInfos) && monfVoteInfos.length > 0) isVote.value = true;
        // commentMap.forEach(e => {
        //     if (e.relations && Array.isArray(e.relations.subCommentIds)) {
        //         e.children = [];
        //         const child = e.relations.subCommentIds.map(e => {
        //             const item = commentMap.find(j => j.id === e) as Comment;
        //             if (item) item.isHidden = true;
        //             return item
        //         })
        //         e.children.push(...child)
        //     }
        //     comments.set(e.id, e)
        // });

        if (monfVoteDetails) {
            monfVoteDetails.forEach(e => {
                scores.value.set(e.id, e)
            })
        }
        if (Array.isArray(monfVoteInfos) && monfVoteInfos.length > 0) {
            monfVoteInfo.value = monfVoteInfos[0]
        }
        if (MONFVoted) {
            myMonfVote.value = typeof MONFVoteId === "number" ? scores.value.get(MONFVoteId) : undefined
        }
        Array.isArray(postLikeUserId) && postLikeUserId.forEach(e => {
            const user = users.get(e);
            if (!user) return;
            likeUsers.value.set(e, user)
        })

        if (!user.value) throw new Error("未查询到发帖人信息")
    });
    function onLoadArticle() {
        return useApiToPagination<Comment, InstanceBody<ArticleBody>, "id">(getArticle, { ...searchParams, id }, "id", ({ data: { includes: { comments, users: includesUsers } } }) => {
            getUserMap(includesUsers, users);
            // includes.categories.forEach(e => {
            //     categories.set(e.id, e)
            // })
            return comments.map(e => {
                if (e.relations && Array.isArray(e.relations.subCommentIds)) {
                    e.children = [];
                    const child = e.relations.subCommentIds.map(e => {
                        const item = comments.find(j => j.id === e) as Comment;
                        if (item) item.isHidden = true;
                        return item
                    })
                    e.children.push(...child)
                }
                return e
            })
        });
    }
    const articlePagination = onLoadArticle()
    // const { list: comment } = articlePagination;
    return {
        article,
        users,
        user,
        userJoinDay,
        likeUsers: ref(likeUsers),
        scores,
        monfVoteInfo: ref(monfVoteInfo),
        // comments: ref(comments),
        /** 是否是可打分的 */
        isVote,
        myMonfVote,
        articlePagination
    }


}

export function init(id: string) {
    /** 搜索筛选 */
    const searchParams = reactive<GetArticleParams>({
        sortField: ArticleSortField.createdDate,
        sortType: "desc",
        page: 1,
        pageSize: 10,
        id,
    });

    /**  帖子的菜单项 */
    const articleActions: any[] = []// [{ text: "举报" }];
    /** MarkDown状态 */
    // const markDownState = reactive({ id: "preview-md" });
    /** 回复评论时候的临时变量 */
    const selectComment = reactive<SelectComment>({
        show: false,
        postId: id,
        id: null,
    });

    const ArticleInfo = getArticleInfo(id, searchParams);
    return {
        searchParams,
        articleActions,
        // markDownState,
        selectComment,
        ...ArticleInfo,
    }
}
/** init方法注入的返回值 */
export type ArticleInit = ReturnType<typeof init>


/** 点赞接口 */
export async function like_this(article: Ref<Article>) {
    // try {
    const store = useUserStore()
    if (!store.logged.login) {

        window.Nmessage.warning("您还未登录");
        return;
    }
    let isLike = article.value.relations.isLiked;
    if (isLike === false) isLike = undefined;
    await like(article.value.id, isLike);
    const sum = isLike ? -1 : 1
    window.Nmessage.success(isLike ? "取消点赞" : "点赞成功");
    article.value.likeCount += sum;
    article.value.relations.isLiked = !isLike;
}

