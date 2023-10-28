import { defineStore } from "pinia"
import type { LoginBody, User } from "@/api/user"

import { reactive, ref } from "vue"
export const useUserStore = defineStore('user', () => {
    const logged = reactive({
        token: "",
        exp: "",
        login: false,
    });
    const userInfo = ref<User | null>(null)
    function setLogged(e: LoginBody) {
        logged.login = true;
        logged.exp = e.token.exp
        logged.token = e.token.value;
        userInfo.value = e.user;
        if (typeof userInfo.value.avatarUrl === "string" && userInfo.value.avatarUrl.length > 0 && !userInfo.value.avatarUrl.startsWith("http")) {
            userInfo.value.avatarUrl = `http://assets.mughome.top/avatar/${userInfo.value.avatarUrl}`
        }
        localStorage.setItem("MUG_USER_INFO", JSON.stringify(e));
        if (typeof logged.exp !== "number") return;


    }
    function resetLogged() {
        logged.token = "";
        logged.exp = "";
        logged.login = false;
        localStorage.clear()
    }


    return { logged, userInfo, setLogged, resetLogged }
})