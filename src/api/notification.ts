import { request } from "@/utils/request"

/**
 * @GET 帖子详情
 * @param id 帖子Id
 * */
export function getNotification(key: string) {
    return request(`/notification`, {
        method: "GET",
       
    });

}