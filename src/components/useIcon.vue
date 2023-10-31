<template>
    <i :class="src" :style="Styles"></i>
</template>

<script lang="ts" setup>
import { computed,type CSSProperties } from 'vue';

interface Prop {
    src?: string;
    size?: string | number;
    color?: string;
}

const prop = defineProps<Prop>()
const Styles = computed<CSSProperties>(() => {
    return {
        fontSize: prop.size + "px",
        color: prop.color
    } as CSSProperties
})
</script>
<style scoped>
.icon {
    fill: var(--mug-text);
}
</style>
