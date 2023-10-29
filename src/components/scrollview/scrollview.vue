<template>
    <div class="ScrollView" @scroll="scroll">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { DIRECTION } from '@/utils';
import { inject } from 'vue';

interface Emits {
    (event: 'load'): void
}
// const header = inject<{ showHeader: (direction: DIRECTION) => void }>("header")
// let beforeScrollLocal = 0
const emit = defineEmits<Emits>()
function scroll(e: UIEvent) {
    /** 触发阈值 */
    const threshold = 200;
    const { scrollTop, clientHeight, scrollHeight } = e.target! as HTMLDivElement;
    // let direction = DIRECTION.DOWN
    // if (beforeScrollLocal > scrollTop) {
    //     direction = DIRECTION.UP;
    // }
    // console.log(header)
    // header?.showHeader(direction)
    if (scrollTop + clientHeight + threshold >= scrollHeight) {
        emit("load")
    }
}
</script>
<style lang="scss" scoped>
.ScrollView {
    scroll-behavior: smooth;
    overflow-y: auto;
    flex: 1;
    max-height: 100%;
    position: relative;
}
</style>