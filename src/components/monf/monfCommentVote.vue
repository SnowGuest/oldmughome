<template>
    <div class="flex justify-between items-end">
        <div class="CommentVote" v-if="vote" :class="{ CommentVoteSlashed: getSlashed() }">
            <h4 style="width:100%">作品评价</h4>
            <span style="white-space: nowrap;">
                <span>谱面评分:</span>
                <span style="font-size:22px; margin-right: 24px;"> {{ vote.chartScore ?? "无" }}</span>
            </span>
            <span>音乐评分:</span>
            <span style="font-size:22px;"> {{ vote.musicScore ?? "无" }}</span>
            <div class="CommentVoteShash" v-if="getSlashed()">
                削票原因:{{ vote.slashReason || "无" }}
            </div>
        </div>
        <div v-else></div>



        <n-popselect :options="actions" trigger="click" @update:value="selectMenu"
            v-if="loginUser.userInfo && loginUser.userInfo?.role > 0">
            <box-icon name='dots-horizontal-rounded' class="moreMenu"></box-icon>
        </n-popselect>

    </div>
</template>

<script lang="ts" setup>
import { MonfComment, cutOffTicketAPI } from '@/api/monf';

import { useUserStore } from '@/stores/user';
import { useMessage } from 'naive-ui';
import { computed } from 'vue';
const prop = defineProps<{
    vote?: MonfComment;
}>()
const emit = defineEmits<{
    updateComment: [e: MonfComment]
}>();
const messages = useMessage()
function getSlashed() {
    return prop.vote?.isSlashed
}
const actions = computed(() => {
    const list = []
    if (loginUser.userInfo && loginUser.userInfo?.role > 0) list.push({ value: "+1", label: "削票" })
    return list
})
const loginUser = useUserStore();
const arr = new Map<string, Function>([["+1", cutOffTicket]])
function selectMenu(e: string) {
    const func = arr.get(e)
    if (func) func()
}
async function cutOffTicket() {
    if (getSlashed()) {
        messages.warning("已经削过票了")
        return;
    }
    if (loginUser.userInfo && loginUser.userInfo.role <= 0) return;
    if (!prop.vote) return;
    const message = prompt("请输入削票原因(选填)");
    if (message === null) return;
    const { data: { workComment }, code } = await cutOffTicketAPI(`${prop.vote.id}`, message);
    if (code === 0) {
        emit("updateComment", workComment)
        messages.success("削票成功")
    }
}
</script>
<style lang="scss" scoped>
@media screen and (max-width: 1240px) {
    .CommentVote {
        min-width: 260px;
    }
}

.CommentVote {
    display: flex;
    padding: 10px 14px;
    font-size: 16px;
    border-radius: 8px;
    // border: 1px solid var(--mug-dividing);  
    flex-wrap: wrap;
    width: 40%;
    background-color: #EDF6FD;
    border: 1px solid rgba(199, 223, 251, 1);
    color: var(--mug-text);
    align-items: center;
    margin-top: 14px;
}

.CommentVoteSlashed {
    background-color: #FBEEF1;
    border-color: rgba(243, 203, 211, 1);

    span {
        color: #999;
        text-decoration: line-through;
    }

    h4 {
        display: none;
    }
}
</style>