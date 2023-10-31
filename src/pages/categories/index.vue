<template>
    <ScrollView>
        <div class="mainPageBody flex justify-center">

            <div class="mainPage">
                <div class="card">
                    <h2>全部分区</h2>
                    <div v-for="item in categories" :key="item.id" class="mb-6">
                        <RouterLink class="mb-4 flex items-center" target="_blank" :to="`/categorie/${item.id}`">
                            <h5 class="categorie-title">{{ item.name }}({{ item.postCount }})</h5>
                            <img width="14" height="14" src="@/assets/icon/arrow-right.svg" alt="">
                        </RouterLink>
                        <ul class="allcategories" v-if="item.children">
                            <categorieVue v-for="child in item.children" :key="child.id" :categorie="child" />
                        </ul>
                        <!-- <div v-else>
                    暂无子分区
                </div> -->
                    </div>
                </div>
            </div>
            <SideBar :categorie="false" :check="false" />
        </div>
    </ScrollView>
</template>

<script lang="ts" setup>
import { useHead } from '@unhead/vue'
import { type Categorie, getCategories } from '@/api/categorie';
import SideBar from '@/components/sideBar/index.vue';
import categorieVue from '@/components/categories/index.vue';
import { inject, ref } from 'vue';
// const base = inject<Base>("Base");
const categories = ref<Categorie[]>([])
async function init() {
    const { data } = await getCategories()
    categories.value = data.categories.filter(e => !e.isHidden)
}
init();
// base?.setLoading(false)
useHead({
    title: "分区 - MUGHome",
})
</script>
<style lang="scss" scoped>
.card {
    background-color: var(--mug-card-bg);
    border-radius: 6px;
    padding: 20px 30px;
    margin-bottom: 14px;
    color: var(--mug-text);

    h2 {
        color: var(--mug-text);

        font-weight: 600;
        font-size: 20px;
        margin-bottom: 20px;
        border-bottom: 1px solid var(--mug-dividing);
        padding-bottom: 12px;
    }
}

.mainPageBody {
    margin: 0 auto;
    padding-top: 16px;
}

.mainPage {
    flex: 1;
    max-width: 770px;
}

@media screen and (max-width: 1170px) {
    .allcategories {
        grid-template-columns: 1fr 1fr !important;
    }
}

.allcategories {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 16px;
    row-gap: 16px;
    padding-bottom: 18px;
    // margin-bottom: 18px;
    // border-bottom: 1px solid var(--mug-dividing);
}

.categorie-title {
    color: #c2c2c2;
    font-weight: 400;

    &:hover {
        color: #908f8f;
    }
}
</style>