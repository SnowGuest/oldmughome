import { ErrorInstall, request } from "@/utils/request";
import { ArticleParams, ArticlesBody } from "./post";

/**
 * @GET 帖子列表
 * @param userid 用户Id
 * @param sort 排序规则
 * @param page 第几页
 * @param categorieId 分区id
 * @param pagesize 本页多少条
 * */
 export async function getContestList( params: ArticleParams, opt: ErrorInstall = {
    "FetchError": "获取帖子信息失败"
}) {
    const result = await request<ArticlesBody>("vote/monf", {
        method: "GET",
        params,
    }, opt);

    return result
}