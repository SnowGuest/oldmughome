import { request } from "@/utils/request"

export interface Banner {
    imageUrl: string;
    linkUrl: string;
    description: string;
};
export type BannerBody = { banners: Banner[] }

export function getBanners() {
    return request<BannerBody>("/banner", {
        method: "GET",
    })
}


export function getBannersssss() {
    return request<BannerBody>("/demodmeode", {
        method: "GET",
    })
}