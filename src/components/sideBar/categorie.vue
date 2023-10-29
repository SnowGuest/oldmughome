
<template>
    <div class="card column">
        <h3 class="categories-title">推荐分区</h3>
        <ul class="categories">
            <li class="categorie center" v-for="item in categories" :key="item.id">
                <NuxtLink :to="`/categorie/${item.id}`" class="column center" target="_blank" rel="bookmark">
                    <i :style="{ fontSize: '22px', color: item.color }" :class="item.icon"></i>
                    <span class="categorie-text">{{ item.name }}</span>
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { Categorie } from '~/api/categorie';

const categories = ref<Categorie[]>([]);
// async function init() {
//     const { data, error, refresh, execute } = await getCategories("right/categories")
//     if (data.value?.code !== 0) return []
//     return data.value.data.categories
// }
// const categories = await init();
</script>
<style lang="scss" scoped>
.categories-title {
    color: var(--mug-card-text);
    font-weight: 500;
    font-size: 22px;
    margin-bottom: 14px;
}

.categories {
    --cardHeight: 100px;
    display: grid;
    grid-template-columns: repeat(3, var(--cardHeight));
    justify-content: space-between;
    grid-row-gap: 32px;
    row-gap: 32px;
    margin-top: 14px;
}

.categorie {
    height: var(--cardHeight);
    width: var(--cardHeight);
    border-radius: 10px;
    transition: all 0.23s;
    cursor: pointer;

    &-text {
        font-size: 14px;
        white-space: nowrap;
        margin-top: 14px;
        color: var(--mug-card-text);
    }

    &:hover {
        background-color: rgb(102, 102, 102, 0.12);
    }
}
</style>