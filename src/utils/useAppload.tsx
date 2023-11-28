import type { LoginBody } from "@/api/user";
import { useUserStore } from "@/stores/user";
import { useMessage, useNotification } from "naive-ui";
import { defineCustomElement } from "vue";
import Bilibili from '../components/bilibili.ce.vue'
export function useApploadData() {
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
    let locale = localStorage.getItem("local") || navigator.language.toLowerCase();
    if (!["zh-cn", "en-us"].includes(locale)) {
        locale = "zh-cn"
    }
    return {
        locale
    }
}
export function useAppload() {
    const message = useMessage();
    const notification = useNotification();
    window.Nmessage = message;
    window.Nnotification = notification

}