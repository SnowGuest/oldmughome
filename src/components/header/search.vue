<template>
    <nav class="searchBody items-center flex ml-3 mr-3 pl-3 pr-3">
        <img class="searchIcon mr-2" src="@/assets/icon/search.svg" alt="">
        <input type="text" v-model="searchText" :placeholder="$t('component.header.searchPlaceholder')"
            @keydown.enter="toSearch" />
    </nav>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
const searchText = ref("")
const router = useRouter();
function toSearch() {
    router.push({
        path: "/search",
        query: {
            query: searchText.value
        }
    })
}
</script>
<style lang="scss" scoped>
.searchBody {
    border-radius: 50px;
    width: 500px;
    height: 50%;
    box-shadow: 0 0 35px #6b6b6b1a;
    background-color: #fff;

    .searchIcon {
        height: 50%;
    }

    input {
        flex: 1;
        height: 100%;
        border: none;
        background-color: transparent;
        outline: none;
        font-size: 16px;

        &::-moz-placeholder,
        &:-moz-placeholder,
        &::-webkit-input-placeholder,
        &::-ms-input-placeholder {
            font-size: 12px;
        }
    }
}
</style>