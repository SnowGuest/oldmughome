import { request } from "@/utils/request"

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
    postCount: string;
    followerCount: string;
    relations?: {
        /* 是否关注了此用户 */
        isSubscribed?: boolean;
    }

}

export function getUserInfo(id: string | number) {
    return request<User>(`user/${id}`, {
        method: "GET",
    });

}

export function login(data: LoginParams) {
    return request<LoginBody>("account/login", {
        method: "POST",
        data,
    }, {
        13: "该账号未注册",
        12: "用户名或者密码错误",
        21: "账号或密码错误",
        1001: "账号或密码错误"
    });

}

export function register(data: RegisterParams) {
    return request<LoginBody>("account/register", {
        method: "POST",
        data,
    }, {
        41: "验证码错误",
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

export function updateUserInfo( id: User["id"], data: UpdateUserInfoParams) {
    const fd = new FormData();
    Object.keys(data).forEach(k => {
        const v = data[k as keyof UpdateUserInfoParams]
        if (v) fd.append(k, v)
    })
    return request<LoginBody>(`/account/${id}`, {
        method: "PUT",
        data: fd
    }, {
        "-1": "您只能修改自己的账户信息"
    });

}
/**
 * @description 更新用户email
 * */
export function updateUserEmail( id: User["id"], data: UpdateUserInfoParams) {
    return request<LoginBody>(`/account/${id}/email`, {
        method: "PUT",
        data
    }, {
        "-1": "您只能修改自己的账户信息"
    });

}




/**
 * @POST 更换上传头像
 * @param file File
 * */
export function uploaderUserAvatar( id: User["id"], file: File) {
    const fd = new FormData()
    fd.append("avatar", file)
    return request<LoginBody>(`account/${id}`, {
        method: "PUT",
        data: fd,
    }, {
        "FetchError": "上传文件失败"
    });
}


/**
 * @GET 忘记密码
 * @param file File
 * */
export function forgetPassWord( account: string) {
    return request<null>("account/forget", {
        method: "GET",
        params: { account }
    }, {
        "13": "未找到此用户"
    });
}


/**
 * @description 关注用户
 * */

export function followUserApi( userId: string | number) {
    return request<null>(`/user/follow/${userId}`, {
        method: "GET",
    }, {
        13: "未找到此用户",
        34: "您不能关注您自己"
    });
}
export function unfollowUserApi( userId: string | number) {
    return request<null>(`/user/unfollow/${userId}`, {
        method: "GET",
    }, {
        "13": "未找到此用户"
    });
}


/**
 * @
 * */
export async function getCaptcha(key: string) {
    return request<{
        uuid: string;
        imgBase64: string;
    }>(`/captcha`, {
        method: "GET",
    });

}


/**
 * @
 * */
export async function sendEmailCode( email: string) {
    return request<null>(`/account/sendRegisterCode`, {
        method: "GET",
        params: {
            email
        }
    }, {
        16: "该邮箱已绑定其他用户",
    });

}