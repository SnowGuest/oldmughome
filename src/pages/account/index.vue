<template>
    <ScrollView>
        <div class="flex mainPageScroll justify-center">
            <aside v-if="self" class="affixElement">
                <ul class="leftMenu">
                    <li @click="toPage(item)" v-for="item in menus" :class="{ menuCheck: item.id === checkMenu }">{{
                        item.label
                    }}
                    </li>
                </ul>
            </aside>
            <div class="todo-menu" @click="moblieShow = !moblieShow">
                <Icon size="30" name="material-symbols:checklist"></Icon>
            </div>
            <n-modal v-model:show="moblieShow" style="top:200px;border-radius: 0px 8px 8px 0; ">
                <ul class="leftMenu" style="margin-right: 0px;">
                    <li @click="toPage(item)" v-for="item in menus" :class="{ menuCheck: item.id === checkMenu }">{{
                        item.label
                    }}
                    </li>
                </ul>
            </n-modal>
            <div class="rightPage">
                <KeepAlive>
                    <component :self="self" :is="menu"></component>
                </KeepAlive>
            </div>
            <SideBar v-if="!self" />
        </div>
    </ScrollView>
</template>

<script lang="ts" setup>
import ScrollView from "@/components/scrollview/scrollView.vue"
import SideBar from '@/components/sideBar/index.vue';
import homeVue from "@/components/account/home.vue"
import avatarVue from "@/components/account/avatar.vue"
import accountSafeVue from "@/components/account/accountSafe.vue"
import thirdPartyVue from "@/components/account/thirdParty.vue"
import myInfoVue from "@/components/account/myInfo.vue"
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
// import { Sticky, Popup } from "vant";
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
const moblieShow = ref(false);
const menus = [
    { id: 1, component: homeVue, label: "首页" },
    { id: 2, component: myInfoVue, label: "我的信息" },
    { id: 3, component: avatarVue, label: "我的头像" },
    { id: 5, component: accountSafeVue, label: "账户安全" },
    // { id: 4, component: thirdPartyVue, label: "第三方账号" }
] as const
const checkMenu = ref<typeof menus[number]["id"]>(1);
const route = useRoute()
const userStore = useUserStore();
const { userInfo, logged } = storeToRefs(userStore)
function isSelf() {
    if (typeof route.params.id !== "string") return false;

    return route.params.id === userInfo.value?.id.toString();
}
const self = computed(isSelf);

const menu = computed(() => {
    return menus.find(e => e.id === checkMenu.value)?.component
})
function toPage(e: typeof menus[number]) {
    checkMenu.value = e.id;
    moblieShow.value = false
}

</script>
<style lang="scss" scoped>
.affixElement{
    position: sticky;
    top: 16px;

    align-self: flex-start;

}
@media screen and (max-width: 768px) {

    .mainPageScroll {
        max-width: 100vw;
    }
}

.mainPageScroll {
    margin: 0 auto;
    padding-top: 16px;
}

.todo-menu {
    display: none;
    position: absolute;
    top: 316px;
    left: 0;
    border-radius: 0px 8px 8px 0px;
    width: 50px;
    height: 50px;
    background-color: rgb(33, 33, 33, 0.31);
    color: #FFFFFF;
    z-index: 1;
    cursor: pointer;
    align-items: center;
    justify-content: center;
    color: #FFFFFF;
}

.leftMenu {
    background-color: var(--mug-card-bg);
    border-radius: 8px;
    margin-right: 12px;
    overflow: hidden;
    .menuCheck {
        background-color: var(--mug-dividing);
    }

    li {
        height: 50px;
        display: flex;
        align-items: center;
        transition: all 0.32s;
        padding: 0 24px;
        cursor: pointer;

        &:hover {
            background-color: var(--mug-dividing);
        }
    }
}

.rightPage {
    flex: 1;
    margin-bottom: 24px;
    max-width: 770px;
    width: 100%;
}

@media screen and (max-width: 1000px) {

    .rightPage {
        max-width: calc(100vw - 32px);
    }

    .todo-menu {
        display: flex;
    }

    .left-menu-sticky {
        display: none;
    }
}
</style>
