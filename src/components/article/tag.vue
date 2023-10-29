<template>
    <ul class="flex tags items-center">
        <li class="tag " v-for="item in newTags" :style="{ background: item?.color && Reg2Rgb(item?.color).rgbStr }">
            <RouterLink class="flex items-center" :to="`/categorie/${item?.id}`" target="_blank">
                <i :class="item?.icon" :style="{ color: item?.color }"></i>
                <span> {{ item?.name }}</span>
            </RouterLink>
        </li>
    </ul>
</template>

<script lang="ts" setup>
import { Reg2Rgb } from "@/utils/index"

import { Categorie } from '@/api/categorie';
import { computed } from "vue";

interface Prop {
    tags?: (Categorie | undefined)[]
}
const prop = defineProps<Prop>();
const newTags = computed(() => prop.tags?.filter(e => e) as Categorie[]) 
</script>
<style lang="scss" scoped>
.tags {
    margin-right: auto;

    .tag {
        padding: 4px 12px;
        // border: 1px solid #666666;
        background-color: var(--mug-tag-bg);
        color: var(--mug-tag-Text);
        border-radius: 16px;
        margin-right: 8px;

        i {
            margin-right: 6px;
            font-size: 12px;
        }

        span {
            font-size: 12px;
            white-space: nowrap;
        }
    }
}
</style>