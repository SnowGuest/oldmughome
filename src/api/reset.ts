import { request } from "@/utils/request"
import { LoginBody } from "./user"

export function checkMd5(md5: string,
    t: string,
    type: string) {
    return request<null>("check", {
        method: "get",
        key: "reset/account",
        params: {
            md5,
            t,
            type
        }
    })
}


export function resetPassword(md5: string, value: string) {
    return request<null>("/account/resetAccount", {
        method: "POST",
        key: "reset/account/reset",
        body: {
            md5,
            value
        }
    }, {
        21: "密码不符合要求"
    })
}



export function sendResetEmail(newEmail: string) {
    return request<null>("/account/sendResetEmail", {
        method: "GET",
        key: "reset/account/reset/login/email",
        params: { newEmail }
    })
}
export function resetLoginPassword(password: string, id: string) {
    const body = new FormData();
    body.append("Password",password)
    return request<null>(`/account/${id}`, {
        method: "PUT",
        key: "reset/account/reset/login/password",
        body
    })
}



export function resetEmailLocal(md5: string) {
    return request<null>("/account/resetEmail", {
        method: "GET",
        key: "reset/email",
        params: { md5 }
    }, {
        16: "此邮箱已被其他用户绑定"
    })
}