<template>
    <useHeader />
    <main class="pageBody" ref="pageBody" id="pageBody">
        <!-- <div class="pageBody_content" :class="mode"> -->
        <RouterView />
        <!-- </div> -->
        <n-back-top :right="20" />
    </main>
</template>

<script lang="ts" setup>
import useHeader from "@/components/header/useHeader.vue"
import { useLoadingBar } from "naive-ui";
import { ref, reactive, provide, computed } from "vue";
import { useRoute } from "vue-router";
const loadingBar = useLoadingBar()

export interface Base {
    loading: boolean;
    // scrollTop: () => void;
    setLoading: (bool: boolean) => void;
}
const route = useRoute()
// const pageBody = ref<HTMLElement>()
const base = reactive<Base>({
    loading: false,
    // scrollTop() {
    //     pageBody.value?.scrollTo({
    //         top: 0
    //     })
    // },
    setLoading(bool) {
        base.loading = bool;
        loadingBar[bool ? "start" : "finish"]()
    }
})
provide<Base>("Base", base);
// const mode = computed(() => {
//     const layoutType = route.meta.layoutType; // 控制页面的类型是否是默认竖向
//     const layoutScroll = route.meta.layoutScroll;  // 控制页面是否默认滚动
//     return {
//         column: typeof layoutType === "string" && layoutType === "column",
//         pageContentScroll: typeof layoutScroll === "boolean" ? layoutScroll : true
//     }
// })
// const pageBodyMode = computed(() => {
//     const layoutScroll = route.meta.layoutScroll;  // 控制页面是否默认滚动
//     const scrollBarWidth = route.meta.scrollBarWidth;
//     return {
//         pageScroll: typeof layoutScroll === "boolean" ? layoutScroll : true,
//         scrollBarWidth: typeof scrollBarWidth === "boolean" ? scrollBarWidth : false,
//     }
// })
</script>
<style lang="scss" scoped>
// .scrollBarWidth {
//     padding-right: 0px;
// }

// .column {
//     flex-direction: column !important;
// }

// .pageScroll {
//     overflow-y: auto !important;

// }

// .pageContentScroll {
//     display: flex;
//     justify-content: center;
//     align-items: flex-start;
//     flex-direction: row;
//     flex: 0 !important;
//     max-height: none !important;
// }

.pageBody {
    width: 100%;
    flex: 1;
    // padding-top: 16px;
    z-index: 1;
    overflow: hidden;
    // display: flex;
    // flex-direction: column;
    // position: relative;
    background-color: #F9FAFB;

    // .pageBody_content {
    //     flex: 1;
    //     display: flex;
    //     // flex-direction: column;
    //     max-height: calc(100vh - 70px);
    // }
}
</style>