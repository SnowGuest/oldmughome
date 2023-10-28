import { Article } from "@/api/post";
import { LoginBody, User } from "@/api/user";
import { reactive } from "vue-demi"
import type { UploadFileInfo } from 'naive-ui'

import { uploaderFile } from "@/api/file";
import { defineCustomElement } from "vue";
import Bilibili from '../components/bilibili.ce.vue'
import dayjs from "dayjs";
import { useUserStore } from "@/stores/user";

export function getUserMap(user: User[] = [], userMap?: Map<number, User>) {
    const users = userMap || reactive<Map<number, User>>(new Map<number, User>());
    user.forEach(e => {
        if (typeof e.avatarUrl === "string" && e.avatarUrl.length > 0 && !e.avatarUrl.startsWith("http")) {
            e.avatarUrl = `http://assets.mughome.top/avatar/${e.avatarUrl}`
        }
        if (!users.has(e.id)) {
            users.set(e.id, e)
        }
    })
    return users
}

export function getArticleMap(articles: Article[] = [], user: User[] = []) {
    const users = reactive(new Map());
    const articlesMap = reactive(new Map());
    articles.forEach(e => {
        if (!articlesMap.has(e)) {
            articlesMap.set(e, user)
        }
    })
    return articlesMap
}

/**
 * @description 16进制颜色处理为rgb 带透明度
 * */
export function Reg2Rgb(color?: string, opacity = 0.2) {
    if (!color) throw new Error("请传入Hex颜色");
    let sColor = color.toLowerCase();
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // 如果是16进制颜色
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            var sColorNew = "#";
            for (var i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        //处理六位的颜色值
        var sColorChange = [];
        for (var i = 1; i < 7; i += 2) {
            sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
        }
        return { rgbStr: "rgb(" + [...sColorChange, opacity].join(",") + ")", rgb: sColorChange };
    }
    throw new Error("这不是Hex颜色!")
    // return sColor;
}

/*
 * rgb value to hsl 色相(H)、饱和度(S)、明度(L)
 */
export function rgbToHsl(rgbStr: (string | number)[]) {
    let [r, g, b] = rgbStr.map(e => parseInt(`${e}`));
    r /= 255, g /= 255, b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h: number = 0, s: number, l: number = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h, s, l];
}

/*
 * 判断颜色属于深色还是浅色
 */
export function isColorDarkOrLight(rgbStr: (string | number)[]) {
    let [h, s, l] = rgbToHsl(rgbStr);
    return (l > 0.5) ? 'light' : 'dark';
}


/**
 * @description 处理naive UI的File上传的返回值的响应
 * */
export async function getUploadAction(files: UploadFileInfo[]) {
    const urls: string[] = []
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.file) return [];
        const { data } = await uploaderFile(file.file);
        if (!data.value || data.value.code !== 0) return [];
        urls.push(data.value.data.UploadFileUrl)
    }
    return urls
}

export function delay(time: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time)
    })
}




export function useAppload() {
    const { setLogged, resetLogged } = useUserStore()
    const BilibiliElement = defineCustomElement(Bilibili)
    // 注册
    customElements.define('mug-bilibili', BilibiliElement)
    const userInfoJSON = localStorage.getItem("MUG_USER_INFO");
    if (userInfoJSON) {
        try {
            const parseUserInfo = (userInfoJSON: string) => {
                const userInfo: LoginBody = JSON.parse(userInfoJSON);
                if (userInfo) {
                    const start = Date.now();
                    const end = parseInt(`${userInfo.token.exp}000`)
                    if (start > end || !userInfo.token || !userInfo.user) {
                        throw new Error("登录信息已过期")
                    } else {
                        setLogged(userInfo)
                    }

                }
            }
            parseUserInfo(userInfoJSON)
            window.addEventListener('storage', ({ key, newValue }) => {
                if (key === 'MUG_USER_INFO') {
                    if (newValue) {
                        parseUserInfo(newValue)
                    } else {
                        resetLogged()
                    }
                }
            })
        } catch (error) {
            if (error instanceof Error) {
                localStorage.clear();
                resetLogged()
            }
        }
    }
}