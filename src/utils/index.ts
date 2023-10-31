import type { Article, Pagination } from "@/api/post";
import type { User } from "@/api/user";
import { reactive } from "vue"
import { type UploadFileInfo } from 'naive-ui'

import { uploaderFile } from "@/api/file";
import { type Ref, ref } from "vue";
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
        const data = await uploaderFile(file.file);
        if (!data || data.code !== 0) return [];
        urls.push(data.data.UploadFileUrl)
    }
    return urls
}

export function delay(time: number) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time)
    })
}



export interface useApiToPaginationInstance<T = null> {
    status: Ref<"loading" | "netword" | "end" | "ready" | "zero" | "error">;
    list: Ref<T>;
    next: (page?: number, config?: Record<string, any>) => Promise<void>;
    reload: (config?: Record<string, any>, clear?: boolean) => Promise<void>;
    reset: () => Promise<void>;
}

// export function getDefaultPInstance<V extends Record<string, any>, K extends keyof V>() {
//     type ListInstance = Map<V[K], V>
//     const list = ref<ListInstance>(new Map());
//     const r: useApiToPaginationInstance<ListInstance> = {
//         status: ref("loading"),
//         list,
//         next: async () => { },
//         reload: async () => { },
//         reset: async () => { }
//     }
//     return r
// }
export function useApiToPagination<T extends Record<string, any>, R extends Record<string, any>, K extends keyof T>(request: (...args: any) => Promise<R>, config: Pagination & Record<string, any>, key: K, afterFn?: (data: R) => T[]): useApiToPaginationInstance<Map<T[K], T>> {
    type ListInstance = Map<T[K], T>;
    const sourceConfig = JSON.parse(JSON.stringify(config));
    let newConifg: Pagination = sourceConfig
    let resultPromise = request(newConifg);
    const list = ref<ListInstance>(new Map());
    const loadList = async () => {
        try {


            let result = await resultPromise;
            console.log(result, "我是result")
            let data: T[] = []
            if (afterFn) {
                data = afterFn(result)
            } else {
                data = result.data
            }
            returnData.status.value = "ready"
            if (data.length < newConifg.pageSize) returnData.status.value = "end";
            if (data.length === 0 && newConifg.page === 1) returnData.status.value = "zero";

            data.forEach(e => {
                list.value.set(e[key], e)
            })
        } catch (error) {
            console.log("我是error", error)
        }
    }
    loadList()
    const returnData: useApiToPaginationInstance<ListInstance> = {
        status: ref("loading"),
        list,
        async next(page, config) {
            if (returnData.status.value !== "ready") return;
            if (page) { newConifg.page = page; }
            else newConifg.page = parseInt(`${newConifg.page}`) + 1;
            Object.assign(newConifg, config)
            await returnData.reload(undefined, false)
        },
        async reload(config, clear = true) {
            returnData.status.value = "loading";
            newConifg = sourceConfig
            if (config) Object.assign(newConifg, config);
            if (clear) list.value.clear()
            resultPromise = request(newConifg);
            await loadList()
        },
        async reset() {
            list.value.clear()
            await returnData.next(0);
        }
    }

    return returnData
}


export enum DIRECTION {
    DOWN,
    UP
}
