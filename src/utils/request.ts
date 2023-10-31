import axios, { AxiosError } from "axios"
import type { AxiosRequestConfig, AxiosResponse } from "axios"
import { useUserStore } from "@/stores/user";
import { useMessage, useNotification } from "naive-ui";
export const baseURL = import.meta.env.VITE_FETCH_URL;
export interface InstanceBody<T = null> {
    code: number,
    message: string,
    data: T
}
export interface ErrorInstall {
    [key: string | number]: string
}
const ErrorInstance: ErrorInstall = {
    // 1999: "系统错误请重试",
    "-1": "未授权",
    "10": "注册名称相同",
    "11": "RegisterEmailSame",
    "12": "TermNotAccepted",
    "13": "帐号未注册",
    "14": "NotSendPasswordResetRequest",
    "15": "错误帐户重置代码",
    "21": "登录密码错误",
    "22": "需要重新登录",
    "30": "无法找到用户",
    "31": "用户更新错误",
    "32": "UserHasBeenFollowed",
    "33": "UserNotFollowed",
    "34": "UserCannotOperateFollowSelf",
    "41": "CannotFindVerifyToken",
    "42": "帐户已验证",
    "43": "VerifyEmailNotSend",
    "50": "RequiredToken",
    "51": "令牌格式无效",
    "52": "令牌已过期",
    "53": "TokenSignInvalid",
    "54": "NoNeedToUpdateToken",
    "60": "PostNotFound",
    "61": "PostHasBeenHidden",
    "62": "发布发布参数无效",
    "63": "更新后冲突",
    "64": "PostHaveNoMONFVote",
    "70": "找不到评论",
    "71": "CommentNotInPost",
    "72": "ParentCommentIsSub",
    "80": "找不到标签",
    "90": "找不到类别",
    "100": "文件大小过大",
    "101": "文件格式无效",
    "102": "文件计数无效",
    "103": "NeedLikeForUnlike",
    "104": "已经喜欢",
    "111": "重复打孔",
    "120": "验证码错误",
    "130": "UserHaveVoted",
    "131": "MONFVoteNotExists",
    "132": "MONFVoteAlreadySlashed",
    "1001": "参数无效异常",
    "1999": "未知异常",
}

const useMugFetch = axios.create({
    baseURL,
    timeout: 6000,
});
axios.interceptors.request.use((config) => {
    const { logged, resetLogged } = useUserStore()
    if (logged.login && logged.token && Date.now() < parseInt(`${logged.exp}000`) - 1000) {
        Reflect.set(config.headers, 'Authorization', `Bearer ${logged.token}`)
    } else {
        resetLogged()
    }
    return config
});
// 这是一个测试部署

async function useRequestBody<T extends InstanceBody<any>>(response: Promise<AxiosResponse<T>>, errors: ErrorInstall = ErrorInstance): Promise<T> {
    const notification = window.Nnotification
    const message = window.Nmessage
    const { resetLogged } = useUserStore()
    try {
        const result = await response;
        const { data, config } = result;
        if (data && data.code !== 0) {
            const errorMsg = errors[data.code];
            if (errorMsg) {
                message.error(errorMsg)
            }
        }
        if (data && data?.code === 52) {
            resetLogged()
            return await useRequestBody<T>(useMugFetch<T>(config.url!, config), errors);
        }
        return data

    } catch (error) {
        console.log(error, "我是错误")
        if (error instanceof AxiosError) {
            if (error.response) {

                const { status, data } = error.response;
                if (status !== 200) {
                    let errorMsg = "请求数据失败,请稍后重试"
                    if (!data) {
                        if (!navigator.onLine) errorMsg = "您似乎已经断开和互联网的连接,请检查本机网络后重试";
                    } else {
                        errorMsg = data.message
                    }
                    notification.error({ content: errorMsg })
                }
            } else if (error.message.indexOf("6000ms") !== -1) {
                console.log("进入这里")
                notification.error({ title: "网络出错", content: "远程服务器超时" })
            }

        }

        return new Promise(() => ({
            code: "-9999",
            message: "系统错误",
            data: null
        }))
    }
}


export async function request<T>(url: string, config: AxiosRequestConfig, errors: ErrorInstall = ErrorInstance) {
    return useRequestBody<InstanceBody<T>>(useMugFetch<InstanceBody<T>>(url, config), errors);
}
