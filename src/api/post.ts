import type { Categorie } from "./categorie";
import type { User } from "./user";
import { type ErrorInstall, request } from "@/utils/request";
export interface Article {
    commentCount: number;
    content: string;
    createdDate: string;
    createdUserId: number;
    isHidden: boolean;
    likeCount: number;
    id: number | string;
    title: string;
    viewCount: number;
    introduction: string;
    monfVoteInfoId: string;
    headerImage?: string;
    relations: {
        MONFDetailVotedId?: number;
        MONFVoted?: boolean;
        categoryIds: [number, null | number];
        commentIds: [];
        commentEnd?: boolean;
        isLiked?: boolean;
        postLikeUserId: User["id"][];
    };
}
export interface ArticlesBody {
    includes: {
        users: User[];
        categories: Categorie[];
    };
    post: Article[];
}

export interface Pagination {
    page: string | number;
    pageSize: string | number;
}
export interface ArticleParams extends Pagination {
    userid?: number | string;
    sort?: string | number;
    content?: string;
    categorieId?: string | number;
}

/**
 * @GET 帖子列表
 * @param params.userid 用户Id
 * @param params.sort 排序规则
 * @param params.page 第几页
 * @param params.categorieId 分区id
 * @param params.pagesize 本页多少条
 * */
export async function getArticleList(
    params: ArticleParams,
    opt: ErrorInstall = {
        FetchError: "获取帖子信息失败",
    }
) {
    return request<ArticlesBody>(
        "post",
        {
            method: "GET",
            params,

        },
        opt
    );
}
export interface Comment {
    ReplyId: number;
    content: string;
    createdDate: string;
    createdUserId: number;
    id: number;
    isHidden: boolean;
    likeCount: number;
    postId: number;
    monfVoteDetailId?: number;
    relations?: {
        subCommentIds?: Comment["id"][];
        parentCommentId?: number;
        isLiked?: boolean;
    };
    children: Comment[];
}

export interface ArticleBody {
    post: Article;
    includes: {
        categories: Categorie[];
        comments: Comment[];
        users: User[];
        monfVoteInfos?: MonfVote[];
        monfVoteDetails?: MonfVoteDetail[];
    };
}
/* 打分实例 */
export interface MonfVoteDetail {
    id: number;
    chartScore?: number;
    musicScore?: string;
    createdUserId?: number;
    createdDate?: string;
    monfVoteId?: number;
    /* 是否被削票 */
    isSlashed?: boolean;
    /* 削票时间 */
    slashedDate?: string;
    /* 削票原因 */
    slashReason?: string;
}

/* monf大赛 */
export interface MonfVote {
    id: number;
    /* 必需 */
    chartScoreAverage: number;
    /* 谱面最大分 */
    chartScoreMax: number;
    /* 谱面最小分 */
    chartScoreMin: number;
    /*  */
    chartScoreTotal: number;
    /* 必需 */
    chartScoreVoteCount: number;
    /* 必需 */
    musicScoreAverage: number;
    /* 谱面评分最大值 */
    musicScoreMax: number;
    /* 谱面评分最大数 */
    musicScoreMin: number;
    /* 谱面评分人数 */
    musicScoreTotal: number;
    /*   */
    musicScoreVoteCount: number;
    /* 创建人的用户id */
    createdUserId: number;
    /* 创建时间 */
    createdDate: string;
}

export interface GetArticleParams extends Pagination {
    sortField?: ArticleSortField;
    sortType?: "asc" | "desc";
    id?: Article["id"];
}
/**
 * @GET 帖子详情
 * @param id 帖子Id
 * */
export function getArticle(params: GetArticleParams) {
    const { page, sortField, pageSize, sortType } = params;
    return request<ArticleBody>(`post/${params.id}`, {
        method: "GET",

        params: { page, sortField, pageSize, sortType },
    });
}
/**
 * @readonly
 * @description 查询的枚举值
 * @property {number} CreatDateNew - 最新的评论
 * */
export enum ArticleSortField {
    /** @enum {string} 最新 **/
    createdDate = "createdDate",
    /** @enum {string} 最热 **/
    LikeCount = "likeCount",
}

export interface setArticleParams {
    title: string;
    content: string;
    categoryId: (number | null)[];
    isMONFVote: boolean;
    headerImage?: string;
}
export interface updateArticleParams extends setArticleParams {
    id: string | number;
    LastEditedDate: string | null;
}
/**
 * @POST 发帖
 * @param title 帖子标题
 * */
export function setArticle(data: setArticleParams) {
    return request<ArticleBody>(
        "post/publish",
        {
            method: "POST",
            data,
        },
        {
            62: "发帖失败,请选择正确的分区",
        }
    );
}

/**
 * @POST 重新发帖
 * @param title 帖子标题
 * */
export function updateArticle(data: updateArticleParams) {
    const newBody = JSON.parse(JSON.stringify(data));
    const postId = newBody.id;
    Reflect.deleteProperty(newBody, "id");
    Reflect.deleteProperty(newBody, "categorieId");
    Reflect.deleteProperty(newBody, "isMONFVote");
    return request<ArticleBody>(
        `/post/${postId}`,
        {
            method: "PATCH",
            data: newBody,
        },
        {
            62: "发帖失败,请选择正确的分区",
        }
    );
}

/**
 * @POST 点赞
 * @param id 帖子id
 * */
export function like(id: Article["id"], cancel?: boolean) {
    return request<null>(
        `like/post/${id}`,
        {
            method: "GET",

            params: { cancel },
        },
        {}
    );
}

/**
 * @POST 关注
 * @param id 用户Id
 * */
export function attentionUser(id: string | number) {
    return request<ArticleBody>(`user/follow/${id}`, {
        method: "get",
    }, {
        0: "关注成功"
    });
}

