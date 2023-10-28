import { Categorie } from "./categorie";
import { Comment, GetArticleParams } from "./post";
import { User } from "./user";
import { request } from "@/utils/request"
export interface Bof2023ApplyParams {
    teamName: string,
    songName: string,
    malodySID: string,
    intro: string,
    members: Bof2023ApplyMember[],
    bilibiliLink: string
}
export interface Bof2023ApplyMember {
    memberName: string,
    memberJob: string,
    memberMalodyUID?: number,
}


export interface Bof {
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
    members: Bof2023ApplyMember[];
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

export interface Bof2023ApplyBody {
    work: Bof,
    includes: {
        users: User[]
        comments?: Comment[]
        categories?: Categorie[]
    }
}




interface Bof2023ListBody {
    works: Bof[],
    includes: {
        users: User[]
        comments?: Comment[]
        categories?: Categorie[]
    }
}

/**
 * @GET 获取bof2023列表
 * */
export async function getBof2023List(params: Record<string, any>) {
    return request<Bof[]>(
        "/event/bof/work",
        {

            method: "GET",
            params
        }
    )
}
export interface BofTimeBody {
    RoundIndex: number,
    RoundDate: string,
    Session: string
}
/**
 * @GET 获取bof2023列表
 * */
export function getSelectTimeList(key: string) {
    return request<BofTimeBody[]>(
        "/event/bof/round",
        {

            method: "GET",
        }
    );
}
export interface BofComment {
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
    children?: BofComment[];
    likeCount: number;
    relations?: {
        parentCommentId?: number;
        isLiked?: boolean;
    }
}
export interface Bof2023CommentsBody {
    workComments: BofComment[],
    includes: {
        commentEnd?: boolean;
        users: User[]
    }
}
export interface Bof2023CommentBody {
    workComment: BofComment,
    includes: {
        commentEnd?: boolean;
        users: User[]
    }
}

export interface Bof2023ChartsData {
    works: {
        no: number,
        name: null | string,
        totals: number[]
    }[],
    roundsDate: string[]
}

export async function getChartsData(key: string) {
    return await request<Bof2023ChartsData>(
        "/event/bof/chart",
        {

            method: "GET",
        },
    );

}