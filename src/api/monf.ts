import { Categorie } from "./categorie";
import { Comment, GetArticleParams } from "./post";
import { User } from "./user";

export interface Monf2023ApplyParams {
    teamName: string,
    songName: string,
    malodySID: string,
    intro: string,
    members: Monf2023ApplyMember[],
    bilibiliLink: string
}
export interface Monf2023ApplyMember {
    memberName: string,
    memberJob: string,
    memberMalodyUID?: number,
}

/**
 * @POST monf2023报名
 * @param title 帖子标题
 * */
export function monf2023apply(key:string,body: Monf2023ApplyParams) {
    return request<Monf2023ApplyBody>(
        "event/monf/work/publish",
        {
            method: "POST",
            body,
           
        },
        {
            62: "发帖失败,请选择正确的分区",
        }
    );
}


export function monf2023Edit(key:string,body: Monf & Monf2023ApplyParams) {
    return request<Monf2023ApplyBody>(
        `/event/monf/work/${body.id}`,
        {
            method: "PATCH",
            body,
           
        },
        {
            62: "发帖失败,请选择正确的分区",
        }
    );
}
export interface Monf {
    bilibiliLink: string;
    chartScoreAvg: number;
    chartScoreCount: number;
    chartScoreTotal: number;
    createdDate: string;
    createdUserId: number;
    id: number;
    intro: string;
    malodySID: number;
    likeCount: number;
    members: Monf2023ApplyMember[];
    musicScoreAvg: number;
    musicScoreCount: number;
    musicScoreTotal: number;
    session: string;
    songName: string;
    teamName: string;
    isHidden?: boolean;
    isLiked?: boolean;
    lastCommentDate: string;
    relations?: {
        isLiked?: boolean;
        scoredCommentId?: number;
    }
}

export interface Monf2023ApplyBody {
    work: Monf,
    includes: {
        users: User[]
        comments?: Comment[]
        categories?: Categorie[]
    }
}




interface Monf2023ListBody {
    works: Monf[],
    includes: {
        users: User[]
        comments?: Comment[]
        categories?: Categorie[]
    }
}

/**
 * @GET 获取monf2023列表
 * */
export function getMonf2023List(key:string) {
    return request<Monf2023ListBody>(
        "/event/monf/work",
        {
           
            method: "GET",
        }
    );
}
interface Monf2023Body {
    work: Monf,
    includes: {
        users: User[]
        comments?: Comment[]
        categories?: Categorie[]
        workComments: MonfComment[]
    }

}
/**
 * @POST monf2023
 * @param id monf单项Id
 * */
export function getMonf2023( id: string) {
    return request<Monf2023Body>(
        `event/monf/work/${id}`,
        {
           
            method: "GET",
        }
    );
}

export interface MonfComment {
    chartScore: number;
    comment: string;
    createdDate: string;
    createdUserId: number;
    id: number;
    isSlashed: boolean,
    musicScore: number;
    workId: number;
    isHidden?: boolean;
    slashReason?: string;
    children?: MonfComment[];
    likeCount: number;
    relations?: {
        parentCommentId?: number;
        isLiked?: boolean;
    }
}
export interface Monf2023CommentsBody {
    workComments: MonfComment[],
    includes: {
        commentEnd?: boolean;
        users: User[]
    }
}
export interface Monf2023CommentBody {
    workComment: MonfComment,
    includes: {
        commentEnd?: boolean;
        users: User[]
    }
}

/**
 * @POST monf2023获取评论
 * @param id monf单项Id
 * */
export function getMonf2023Comment( params: GetArticleParams) {
    console.log(params, '????????????')
    return request<Monf2023CommentsBody>(
        `/event/monf/work/${params.id}/comment`,
        {
            method: "GET",
           
            params
        }
    );
}

export interface monf2023CommentParams {
    workId: number | string,
    comment: string,
    musicScore?: number,
    chartScore?: number
}


/**
 * @POST monf2023发布评论
 * */
export function monf2023Comment( body: monf2023CommentParams) {
    return request<Monf2023CommentBody>(
        `/event/monf/comment/publish`,
        {
           
            method: "POST",
            body
        },
        { 130: "你已经打过分了" }
    );
}




/**
 * @POST monf2023更新评论
 * */
export function monf2023CommentUpdate(workCommentId: number,  body: monf2023CommentParams) {
    return request<Monf2023CommentBody>(
        `/event/monf/comment/${workCommentId}`,
        {
           
            method: "PATCH",
            body
        },
    );
}



/**
 * @POST monf2023评论点赞
 * */
export function monfCommentLike( monfWorkCommentId: number) {
    return request<Monf2023CommentBody>(
        `/event/monf/comment/${monfWorkCommentId}/like`,
        {
           
        },
    );
}




/**
 * @POST monf2023评论取消点赞
 * */
export function monfunCommentLike( monfWorkCommentId: number,) {
    return request<Monf2023CommentBody>(
        `/event/monf/comment/${monfWorkCommentId}/unlike`,
        {
           
        },
    );
}


/**
 * @POST monf2023评论取消点赞
 * */
export function monfunLike( monfWorkId: number,) {
    return request<Monf2023CommentBody>(
        `/event/monf/work/${monfWorkId}/unlike`,
        {
           
        },
    );
}

/**
 * @POST monf2023评论取消点赞
 * */
export function monfLike( monfWorkCommentId: number,) {
    return request<Monf2023CommentBody>(
        `/event/monf/work/${monfWorkCommentId}/like`,
        {
           
        },
    );
}



/**
 * @POST 削票
 * @param workCommentId 投票评论Id
 * @param reason 削票理由
 * */
export function cutOffTicketAPI(
    key:string,
    workCommentId: string,
    reason?: string | null
) {
    return request<Monf2023CommentBody>(
        `/event/monf/comment/${workCommentId}/slash`,
        {
           
            params: {
                reason,
            },
        },
        {
            "-1": "您暂无权限",
            131: "不存在评分信息",
        }
    );
}
