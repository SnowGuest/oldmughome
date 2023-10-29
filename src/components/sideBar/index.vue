
<template>
    <div class="sidebar  flex column">
        <slot></slot>
        <categorie v-show="categorie" />
        <checkIn v-show="check" />
        <downloadApp v-show="appDownload" />
        <pageFooter />
    </div>
</template>

<script lang="ts" setup>
import PageFooter from './pageFooter.vue';
import DownloadApp from './downloadApp.vue';
import CheckIn from './checkIn.vue';
import Categorie from './categorie.vue';



// import { getCategories } from '~~/api/categorie';
// const tags = ref<string[]>(["Ikun", "唱", "跳", "Rap", "篮球", "music", "鸡你太美", "在看一眼就会爆炸"])
// const colors: string[] = ["#F24657", "#F35656", "#F57053", "#F68851", "#F79050", "#F8A44E", "#FAB54D", "#FBC94B"]

interface Prop {
    tag?: boolean;
    check?: boolean;
    categorie?: boolean;
    appDownload?: boolean;
}
withDefaults(defineProps<Prop>(), {
    tag: true,
    check: true,
    categorie: true,
    appDownload: true,
})



</script>
<style lang="scss" scoped>
// .tags {
//     .tag {
//         border-bottom: 1px solid var(--mug-tag-line);
//         padding-bottom: 6px;
//         font-size: 14px;
//         margin-bottom: 12px;
//         color: var(--mug-card-text);

//         i {
//             margin-right: 6px;
//         }


//         span {
//             margin-left: auto;
//             color: #666666;
//         }
//     }
// }


/* 小于1170px 隐藏侧栏 */
@media screen and (max-width: 1240px) {
    .sidebar {
        display: none;
    }
}

.sidebar {
    position: sticky;
    top: 0px;
    z-index: 1;
    min-width: 410px;
    width: 410px;
    margin-left: 14px;

    .card {
        background-color: var(--mug-card-bg);
        border-radius: 6px;
        padding: 20px 30px;
        margin-bottom: 14px;
    }
}
</style>