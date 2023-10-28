import { request } from "@/utils/request"

/**
 * @GET 帖子详情
 * @param id 帖子Id
 * */
export function getNotification() {
    return request(`/notification`, {
        method: "GET",
    });

}