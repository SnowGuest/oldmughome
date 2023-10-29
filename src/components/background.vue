
<template>
    <div class="box">
        <img width="770" height="770" class="image" :src="imageSrc" alt="背景图">
    </div>
</template>

<script lang="ts" setup>
import defalutSrc from "assets/image/userBg.jpg"
import { computed } from "vue";
interface Props {
    src?: string
}
const props = defineProps<Props>()

const imageSrc = computed(() => {
    return props.src || defalutSrc
})
</script>
<style lang="scss" scoped>
.box {
    width: 100%;
    height: 100%;
    position: relative;

    &::after {
        position: absolute;
        top: 0;
        left: 0;
        content: "";
        height: 100%;
        width: 100%;
        // backdrop-filter: blur(1px);
    }

    .image {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}
</style>