import { request } from "@/utils/request"
import { FileBody } from "./file";

export interface LoginParams {
    account: string; //    用户名或邮箱
    password: string;// 密码
    isRemember: boolean; // 是否必填
}
export interface RegisterParams {
    email: string;
    code: string;
    name: string; //    用户名或邮箱
    password: string;// 密码
    captchaValue: string;
    captchaUUID: string;
    RegisterCode: "",
    isAcceptTerm: boolean; // 同意注册协议 
}
export interface LoginBody {
    token: Token;
    user: User;
}
export interface Token {
    value: string; // token
    exp: string; // 有效期
}
export interface User {
    /** @description {number} 用户邮箱 **/
    email: string;
    /** @description {number} 用户Id **/
    id: number;
    /** @description {string} 用户名 **/
    name: string;
    /** @description {string} 昵称 **/
    nickName: string;
    /** @description {number} 权限值 **/
    role: number;
    /** @description {string} 注册日期 **/
    createdDate: string;
    /** @description {string} 头像 **/
    avatarUrl?: string;
    /** @description {string} 积分 **/
    points: string;
    /** @description {string} 连续签到日期 **/
    continuousPunchCount: string;
    bio?: string,
    userCoverUrl?: string
    postCount:string;
    followerCount:string;
    relations?: {
        /* 是否关注了此用户 */
        isSubscribed?: boolean;
    }

}

export function getUserInfo(key: string, id: string | number) {
    return request<User>(`user/${id}`, {
        method: "GET",
        key
    });

}

export function login(body: LoginParams) {
    return request<LoginBody>("account/login", {
        method: "POST",
        body,
        key:"/login"
    }, {
        13: "该账号未注册",
        12: "用户名或者密码错误",
        21: "账号或密码错误",
        1001:"账号或密码错误"
    });

}

export function register(body: RegisterParams) {
    return request<LoginBody>("account/register", {
        method: "POST",
        body,
        key:"/register"
    }, {
        41:"验证码错误",
        11: "邮箱已被占用",
        21: "账号或密码错误",
        120: "验证码错误",
        1001: "请填写正确的表单信息"
    });
}

export interface UpdateUserInfoParams {
    nickName?: User["nickName"];
    bio?: User["bio"];
    userCover?: File;
}

export function updateUserInfo(key: string, id: User["id"], body: UpdateUserInfoParams) {
    const fd = new FormData();
    Object.keys(body).forEach(k => {
        const v = body[k as keyof UpdateUserInfoParams]
        if (v) fd.append(k, v)
    })
    return request<LoginBody>(`/account/${id}`, {
        key,
        method: "PUT",
        body: fd
    }, {
        "-1": "您只能修改自己的账户信息"
    });

}
/**
 * @description 更新用户email
 * */
export function updateUserEmail(key: string, id: User["id"], body: UpdateUserInfoParams) {
    return request<LoginBody>(`/account/${id}/email`, {
        key,
        method: "PUT",
        body
    }, {
        "-1": "您只能修改自己的账户信息"
    });

}




/**
 * @POST 更换上传头像
 * @param file File
 * */
export function uploaderUserAvatar(key: string, id: User["id"], file: File) {
    const fd = new FormData()
    fd.append("avatar", file)
    return request<LoginBody>(`account/${id}`, {
        method: "PUT",
        body: fd,
    }, {
        "FetchError": "上传文件失败"
    });
}


/**
 * @GET 忘记密码
 * @param file File
 * */
export function forgetPassWord(key:string,account: string) {
    return request<null>("account/forget", {
        method: "GET",
        key,
        query: { account }
    }, {
        "13": "未找到此用户"
    });
}


/**
 * @description 关注用户
 * */

export function followUserApi(key:string,userId: string | number) {
    return request<null>(`/user/follow/${userId}`, {
        method: "GET",
        key,
    }, {
        13: "未找到此用户",
        34: "您不能关注您自己"
    });
}
export function unfollowUserApi(key:string,userId: string | number) {
    return request<null>(`/user/unfollow/${userId}`, {
        method: "GET",
        key:`/article/followUser`
    }, {
        "13": "未找到此用户"
    });
}


/**
 * @
 * */
export async function getCaptcha(key:string) {
    return request<{
        uuid: string;
        imgBase64: string;
    }>(`/captcha`, {
        key,
        method: "GET",
    });

}


/**
 * @
 * */
export async function sendEmailCode(key:string,email: string) {
    return request<null>(`/account/sendRegisterCode`, {
        method: "GET",
        key,
        params: {
            email
        }
    }, {
        16: "该邮箱已绑定其他用户",
    });

}