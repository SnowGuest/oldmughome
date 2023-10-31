<template>
    <ScrollView>
        <div class="monf2023">
            <div class="monf2023Header">
                <RouterLink to="https://www.bilibili.com/read/cv24413136" target="_blank">
                    <img width="768" height="345" src="@/assets/image/monf2023/MONF2023v2.1.png" alt="头图" />
                </RouterLink>
            </div>
            <div class="ruleCard">
                <div class="flex justify-center" style="font-size: 2em;">
                    <RouterLink to="https://www.bilibili.com/read/cv24413136" target="_blank"
                        style="color: white; text-shadow: 0 0 20px #38abed, 0 0 15px #38abed; font-weight: bold;">点此查看比赛规则
                    </RouterLink>
                </div>
            </div>
            <div class="cards">
                <div class="card">
                    <div>
                        <div style="text-align: center; font-weight: bold; font-size: 1.4em; margin-bottom: 10px;">比赛日程
                        </div>
                        <div style="margin: auto;">
                            <div class="scheduleLine">
                                <p>开放投稿/<br />评分开始：</p>
                                <time>2023年07月29日 00:00</time>
                            </div>
                            <div class="scheduleLine">
                                <p>截稿</p>
                                <time>2023年08月31日 16:00</time>
                            </div>
                            <div class="scheduleLine">
                                <p>评分结束</p>
                                <time>2023年09月09日 16:00</time>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="card">
                    <div style="text-align: center;">已有</div>
                    <div style="text-align: center; font-weight: bold; font-size: 4em;">{{ monfList.length }}</div>
                    <div style="text-align: center;">份作品参赛</div>
                </div>
                <div class="card">
                    <div v-if="endDate > 0">
                        <div style="text-align: center;">距离结束还有</div>
                        <div style="text-align: center; font-weight: bold; font-size: 4em;">{{ endDate }}</div>
                        <div style="text-align: center;">天</div>
                    </div>
                    <div v-else style="height:100%;display: flex;align-items: center;justify-content: center;">当前比赛已截止投稿
                    </div>
                </div>
            </div>

            <div class="Monf2023Table">
                <n-data-table :row-props="rowProps" scroll-x="700" :columns="columns" :data="monfList" :bordered="false" />
            </div>
        </div>
    </ScrollView>
</template> 

<script lang="tsx" setup>
import {type Monf, getMonf2023List } from "@/api/monf";
import ScrollView from "@/components/scrollview/scrollView.vue";
import { useHead } from "@unhead/vue";
import dayjs from "dayjs";
// import { Base } from "@/layouts/default.vue";
import { type DataTableCreateRowProps, NDataTable, NTag } from "naive-ui";
import {type  TableColumn } from "naive-ui/es/data-table/src/interface";
import { ref } from "vue";
import { useRouter } from "vue-router";
// import { navigateTo } from "nuxt/app";
// const base = inject<Base>("Base");
let endDate = dayjs("2023/09/01 16:00:00").diff(dayjs(), 'day')
const columns: TableColumn<Monf>[] = [
    {
        title: '曲名',
        key: 'songName'
    },
    {
        title: '队名',
        key: 'teamName'
    },
    {
        title: '队员',
        key: 'length',
        render(rowData) {
            return rowData.members.map(e => (<NTag class="mr-2" type="info">{e.memberName}</NTag>))
        },

    },
    {
        title: '平均分',
        key: "chartScoreAvg",
        sorter: (row1, row2) => (row1.chartScoreAvg + row1.musicScoreAvg) - (row2.chartScoreAvg + row2.musicScoreAvg),
        render({ chartScoreAvg, musicScoreAvg }) {
            return (chartScoreAvg + musicScoreAvg).toFixed(2);
        }
    },
    {
        title: '总分',
        key: 'chartScoreTotal',
        sorter: "default",
        render({ chartScoreTotal, musicScoreTotal }) {
            return chartScoreTotal + musicScoreTotal
        },
    },
    {
        title: '排名（平均分）',
        key: 'rank',
        sorter: "default",
    },
    {
        title: '发布日期',
        key: 'createdDate',
        sorter: (row1, row2) => new Date(row1.createdDate).getTime() - new Date(row2.createdDate).getTime(),
        render(rowData) {
            return dayjs(rowData.createdDate).format("YYYY-MM-DD HH:mm")
        },
    }];
const router = useRouter()
const monfList = ref<Monf[]>([])
const rowProps: DataTableCreateRowProps<Monf> = (row) => {
    return {
        onClick() {
            document.title = `${row.songName} - ${row.teamName}`;
            window.open(router.resolve({
                path: `/monf/${row.id}`
            }).href, "_blank")
        
        }
    }
}

async function preload() {
    const { data } = await getMonf2023List();
    if (data) {
        monfList.value = data.works.sort((a, b) => {
            return parseInt(dayjs(b.lastCommentDate).toNow()) - parseInt(dayjs(a.lastCommentDate).toNow())
        });
    }
}
preload();

useHead({
    title: "MONF2023会场 - MUGHome",
})
</script>
<style lang="scss" scoped>
.monf2023Header {
    width: 100%;
    height: 345px;
    background-color: #FFFFFF;
    border-radius: 8px;
    overflow: hidden;

    img {
        width: 100%;
    }
}

.card {
    min-width: 300px;
    flex: 1;
    margin-bottom: 20px;

    div {
        margin-left: auto;
        margin-right: auto;
    }

    background-color: #FFFFFF;
    border-radius: 8px;
    padding: 32px;
}

.cards {
    display: flex;
    flex-wrap: wrap;
    column-gap: 15px;
}

.ruleCard {
    background-color: #b2e9ff;
    border-radius: 8px;
    padding: 10px;
    margin: 20px 0;
}

.Monf2023Table {
    background-color: #FFFFFF;
    overflow-x: auto;
}

.monf2023 {
    width: 968px;
    max-width: 100vw;
    padding: 16px;
    margin: 0 auto;
}

.scheduleLine {
    display: flex;
    justify-self: center;
    align-items: center;

    p {
        flex: 30%;
        font-weight: bold;
    }

    time {
        text-align: right;
    }

    margin-top: 8px;
}
</style>
