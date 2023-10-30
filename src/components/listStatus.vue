<template>
    
    <n-empty style="padding:20vh 0" v-show="status === 'zero'" description="没有数据,看看别的吧" />

    <div v-show="['loading', 'ready'].includes(status)" class="commonBody ">
        <img class="loadingIcon" src="@/assets/icon/loading.svg" alt="">
        加载中
    </div>
    <div v-show="status === 'netword'" @click="pInst.reload()" class="commonBody ">
        <img src="@/assets/icon/netword.svg" alt="">
        网络错误,点击重试
    </div>
    <div v-show="status === 'end'" @click="pInst.reload()" class="commonBody ">
        已经到底啦~
    </div>
</template>

<script lang="ts" setup>
import type { useApiToPaginationInstance } from "@/utils/index"
interface Props {
    status: useApiToPaginationInstance["status"]["value"],
    pInst: useApiToPaginationInstance<any>
}
defineProps<Props>()
</script>
<style lang="scss" scoped>
.commonBody {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #c2c2c2;
    padding: 16px;

    img {
        object-fit: cover;
        width: 20px;
        margin-right: 6px;
    }
}

@keyframes loading {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.loadingIcon {
    animation: loading 1s infinite linear forwards;
}
</style>