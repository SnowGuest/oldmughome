<template>
    <n-modal :show="show" @mask-click="close">

        <!-- <Popup round :show="show" @click-overlay="close" position="center"> -->
        <div class="model">
            <h2>评分</h2>

            <ul class="selectTopTip align-center" :class="{ disabled: loading }">
                <n-popover trigger="click" placement="top">
                    <template #trigger>
                        <li @click="checkEmojiPopover">
                            <span class="EmojiIcon">😀</span>
                        </li>
                    </template>
                    <div style="max-width:300px;height: 244px;width: 300px;">
                        <n-tabs animated>
                            <n-tab-pane :tab="v[0].emoji" v-for="(v, k) in emojis" :name="k" :title="v[0].emoji">
                                <ul class="emojiGrid">
                                    <li @click="setEmoji(item)" v-for="item in v" class="center">
                                        {{ item.emoji }}
                                    </li>
                                </ul>
                            </n-tab-pane>

                        </n-tabs>

                    </div>
                </n-popover>
            </ul>
            <div id="Editor">
                <textarea :disabled="loading" v-model="content" ref="editorInput" type="text"
                    placeholder="请在此处输入评论"></textarea>
            </div>
            <div class="voteBox">
                <n-form-item class="voteInput" :rule="{ required: true, message: '请输入谱面评分' }">
                    <template #label>
                        <n-checkbox v-model:checked="checkedChartVote">谱面分数</n-checkbox>
                    </template>
                    <n-input-number :disabled="!checkedChartVote" clearable :max="100" :min="0" v-model:value="chartScore"
                        button-placement="both" />
                </n-form-item>
                <n-form-item class="voteInput" label="音乐分数" :rule="{ required: true, message: '请输入音乐评分' }">
                    <template #label>
                        <n-checkbox v-model:checked="checkedMusicVote">音乐分数</n-checkbox>
                    </template>
                    <n-input-number :disabled="!checkedMusicVote" clearable :max="100" :min="0" v-model:value="musicScore"
                        button-placement="both" />
                </n-form-item>

            </div>
            <span class="text-3 text-gray" v-if="update">
                <span class="text-red">*</span>
                如果您已经评过分,那么附带分数的评论将会覆盖上一次评分的评论</span>
            <n-button style="margin-top:12px" :disabled="loading" :loading="loading" @click="sendComment" type="primary"
                round block>打分</n-button>
        </div>
    </n-modal>
</template>

<script lang="ts" setup>
import { NFormItem, NInputNumber, NCheckbox, useMessage } from "naive-ui"
import * as unicodeEmoji from 'unicode-emoji';
// import { commentPost } from "@/monf/api/comment";
import { User } from "@/api/user";
import { Article, Comment, MonfVoteDetail } from "@/api/post"
import { monf2023Comment, monf2023CommentParams, monf2023CommentUpdate, MonfComment } from "@/api/monf"
import { ref, nextTick } from "vue";
const checkedChartVote = ref(false)
const checkedMusicVote = ref(false)
const editorInput = ref<HTMLTextAreaElement>()
const content = ref("");
const chartScore = ref(0);
const musicScore = ref(0);
const message = useMessage()

const loading = ref(false)
const emojis = unicodeEmoji.getEmojisGroupedBy("category", {
    version: ["12.1"]
})
const emojiShow = ref(false)


function checkEmojiPopover() {
    // emojiShow.value = !emojiShow.value;
    console.log(emojiShow.value)
}
let startRenge = 0
function setEmoji(e: unicodeEmoji.BaseEmoji) {
    if (editorInput.value) {
        const input = editorInput.value;
        startRenge = input.selectionStart; // 保存常量
        let start = input.selectionStart; // 保存光标位置
        let length = content.value.length; // 记录原本字符长度
        const v = Array.from(content.value); // 数组拆分
        v.forEach((e, i) => {
            if (e.length > 1 && start > i) start -= 1;
        });
        content.value = [...v.slice(0, start), e.emoji, ...v.slice(start)].join("");
        nextTick(() => {
            input.focus();
            input.setSelectionRange(startRenge, startRenge)
        })
    }
}

interface Prop {
    show: boolean;
    monfId: number | string | null;
    update: boolean;
    myWorkId?: number;
    commentId?: number
}
interface Emit {
    (event: 'update:show', bool: boolean): void;
    (event: 'success', user: User[], comment: MonfComment): void

}
const prop = defineProps<Prop>();
const emit = defineEmits<Emit>();

function close() {
    if (!loading.value) {
        emit("update:show", false)
    }
}
async function sendComment() {
    const str = content.value.trim()
    if (str.length <= 0) {
        message.warning("请您输入评论")
        return;
    }

    loading.value = true;
    try {
        if (!prop.monfId) throw new Error("不存在此帖子")
        const monfVote: monf2023CommentParams = {
            workId: prop.monfId,
            comment: str,
        };
        if (checkedChartVote.value) {
            Reflect.set(monfVote, "chartScore", chartScore.value)
        }
        if (checkedMusicVote.value) {
            Reflect.set(monfVote, "musicScore", musicScore.value)
        }
        let data;
        if (prop.update && prop.myWorkId && (checkedChartVote.value || checkedMusicVote.value)) {
            const result = await monf2023CommentUpdate(prop.myWorkId, monfVote)
            data = result.data
        } else {
            const result = await monf2023Comment(monfVote)
            data = result.data
        }

        message.success("评分成功")
        checkedChartVote.value = false
        checkedMusicVote.value = false
        content.value = ""
        chartScore.value = 0
        musicScore.value = 0;
        emit("success", data.includes.users, data.workComment)
        loading.value = false;
        close()
    } finally {
        loading.value = false
    }
}

</script>
<style lang="scss" scoped>
.voteInput {
    width: 45%;

    :deep(.n-checkbox__label) {
        padding-right: 0px;
    }
}

.voteBox {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
}

.model {
    max-width: 90vw;
    width: 450px;
    border-radius: 8px;
    // background-color: var(--mug-card-bg);
    padding: 36px;
    color: var(--mug-text);

    h2 {
        text-align: center;
        margin-bottom: 24px;
    }
}

.EditorEle {
    max-width: 90vw;
    width: 100%;
    max-height: 30vh;
    height: 430px;
}

.emojiGrid {
    width: 300px;
    padding: 6px;
    height: 200px;
    justify-content: space-between;
    display: grid;
    overflow-y: auto;
    grid-template-columns: repeat(8, 30px);

    li {
        width: 30px;
        height: 30px;
        border-radius: 8px;
        transition: all 0.32s;

        // cursor: pointer;
        &:hover {
            background-color: var(--mug-card-sub-bg);
        }
    }

    &::-webkit-scrollbar {
        display: none;
    }
}

.disabled {
    pointer-events: none !important;
    user-select: none !important;

    * {
        user-select: none !important;
        pointer-events: none !important;
    }
}

#Editor {
    background-color: var(--mug-card-sub-bg);
    border-radius: 12px;
    height: 150px;
    overflow: hidden;
    margin-bottom: 12px;
    padding: 8px 0;
    padding-right: 6px;

    textarea {
        border-radius: 12px;
        padding: 6px 12px;
        width: 100%;
        height: 100%;
        border: none;
        background-color: transparent;
        resize: none;

        &::-webkit-scrollbar {
            width: 6px;
        }

        /* 滚动槽 */
        &::-webkit-scrollbar-track {
            border-radius: 10px;
        }

        /* 滚动条滑块 */
        &::-webkit-scrollbar-thumb {
            border-radius: inherit;
            background-color: rgba(144, 147, 153, 0.3);
            -webkit-transition: 0.3s background-color;
            transition: 0.3s background-color;
        }
    }
}

.selectTopTip {
    background-color: var(--mug-card-sub-bg);
    border-radius: 16px;
    margin-bottom: 12px;
    padding: 0 8px;

    .EmojiIcon {
        height: 100%;
        display: flex;
        align-items: center;
        padding-bottom: 3px;
    }

    li {
        user-select: none;
        cursor: pointer;
        font-size: 20px;
        border-radius: 16px;
        height: 34px;
        width: 28px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}

.iconFontSvg {
    transform: translateY(14%);
    cursor: pointer;
}

.previewImage {
    object-fit: cover;
    width: 80px;
    height: 80px;
    border-radius: 4px;
}

.previewImages {
    display: flex;
    margin: 12px 0 0;

    li {
        margin-right: 12px;
        position: relative;
    }

    .close {
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%) translateY(-50%);
        width: 20px;
        height: 20px;
        background-color: var(--mug-card-sub-bg);
        border-radius: 50%;
        cursor: pointer;
        padding: 2px;
    }
}
</style>    
