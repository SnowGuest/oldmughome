import { Article, MonfVoteDetail } from "./post";
import { User } from "./user";
import { Comment } from "@/api/post"
import { request } from "@/utils/request"

interface CommentPost {
    includes: {
        users: User[];
        monfVoteDetails: MonfVoteDetail[]
    }
    comment: Comment;
}
/**
 * @POST 评论
 * @param postId 帖子id
 * */
export function commentPost( postId: Article["id"], content: string, parentCommentId?: string | number, monfVote?: any) {
    let body = {
        postId,
        content,
        parentCommentId,
    };
    if (monfVote) {
        Reflect.set(body, "monfVote", {
            ...monfVote
        })
    }
    return request<CommentPost>("comment/publish", {
        method: "POST",
       
        body
    }, {
        130: "您已经投过票了"
    });
}
/**
 * @POST 点赞评论
 * @param postId 帖子id
 * */
export function commentLike( commentId: Article["id"], cancel?: boolean) {
    return request<CommentPost>(`like/comment/${commentId}`, {
        method: "GET",
       
        query: { cancel }
    });
}
