import { request } from "@/utils/request"

export interface Banner {
    imageUrl: string;
    linkUrl: string;
    description: string;
};
export type BannerBody = { banners: Banner[] }

export function getBanners(key: string) {
    return request<BannerBody>("/banner", {
        method: "GET",
        key
    })
}