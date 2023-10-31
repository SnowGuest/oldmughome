<template>
    <li class="categorie" @click="setTitle">
        <RouterLink :to="`/categorie/${categorie.id}`" class="flex items-center" target="_blank" rel="bookmark">
            <div class="Icon flex items-center justify-center">
                <useIcon :width="24" :height="24" :color="categorie.color" :src="categorie.icon"></useIcon>
            </div>
            <div>
                <h4 class="categorieTitle">{{ categorie.name }}</h4>
                <span class="categoriePeople">{{ categorie.postCount }}帖子</span>
            </div>
        </RouterLink>
    </li>
</template>

<script lang="ts" setup>
import { Categorie } from '@/api/categorie';
import useIcon from '../useIcon.vue';
interface Prop {
    categorie: Categorie
}
const props = defineProps<Prop>()

function setTitle() {
    document.title = `${props.categorie.name} - MUGHome`
}

</script>
<style lang="scss" scoped>
.categorieTitle {
    font-size: 16px;
    margin-bottom: 4px;
    color: var(--mug-text);
}

.categoriePeople {
    display: block;
    font-size: 12px;
    margin-bottom: 4px;
    color: var(--mug-sub-text);
}

.categorieDesu {
    font-size: 13px;
    color: #666;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.categorie {
    border-radius: 8px;
    padding: 12px;
    background-color: var(--mug-card-sub-bg);
    cursor: pointer;

    .Icon {
        min-width: 50px;
        min-height: 50px;
        margin-right: 24px;
        background-color: rgba(102, 102, 102, 0.12);
        border-radius: 16px;
    }
}

@media screen and (max-width: 768px) {
    .categorie {
        min-width: 100%;
    }
}
</style>