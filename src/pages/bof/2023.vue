<template>
    <ScrollView>
        <div class="bof2023">
            <div class="bof2023Header">
                <RouterLink to="https://bmsoffighters.net/bofnt/index.html" target="_blank">
                    <img width="768" height="345" src="@/assets/image/bof2023/BOF2023v2.1.png" alt="头图" />
                </RouterLink>
            </div>

            <div class="cards">
                <div class="card">
                    <div>
                        <div style="text-align: center; font-weight: bold; font-size: 1.4em; margin-bottom: 10px;">比赛日程
                        </div>
                        <div style="margin: auto;">
                            <div class="scheduleLine">
                                <p>评分开始：</p>
                                <time>2023年10月11日 20:00</time>
                            </div>

                            <div class="scheduleLine">
                                <p>评分结束</p>
                                <time>2023年11月26日 22:59</time>
                            </div>
                            <div class="scheduleLine">
                                <p>时间筛选</p>
                                <n-select style="width:40%" @update:value="updateList" v-model:value="searchForm.round"
                                    :options="timeList" />
                            </div>

                        </div>
                    </div>

                </div>

                <div class="card">
                    <div v-if="endDate > 0">
                        <div style="text-align: center;">距离结束还有</div>
                        <div style="text-align: center; font-weight: bold; font-size: 4em;">{{ endDate }}</div>
                        <div style="text-align: center;">天</div>
                    </div>
                    <div v-else style="height:100%;display: flex;align-items: center;justify-content: center;">当前比赛停止评分
                    </div>
                </div>
            </div>
            <div id="VchatBox">

            </div>
            <div class="Bof2023Table">
                <n-data-table :row-props="rowProps" scroll-x="1600" max-height="1000" :columns="columns" :data="bofList"
                    :bordered="false" />
            </div>
        </div>
    </ScrollView>
</template> 

<script lang="tsx" setup>
import { Bof, getBof2023List, getChartsData, getSelectTimeList } from "@/api/bof";
import dayjs from "dayjs";
// import { Base } from "@/layouts/default.vue";
import { type DataTableCreateRowProps, NDataTable, NSelect, SelectOption } from "naive-ui";
import { TableColumn } from "naive-ui/es/data-table/src/interface";
import { useRouter } from "vue-router";
import { watch, nextTick, onMounted, reactive, ref } from "vue";
import { useHead } from "@unhead/vue";
import VChart, { type ISpec } from "@visactor/vchart"
import ScrollView from "@/components/scrollview/scrollView.vue";
const router = useRouter()
// const base = inject<Base>("Base");
let endDate = dayjs("2023/11/26 22:59:59").diff(dayjs(), 'day');
const searchForm = reactive({
    round: undefined
})
const columns: TableColumn<Bof>[] = [
    {
        title: '编号',
        key: 'No',
        width: 80,
    },
    {
        title: '队伍名称',
        key: 'Team',
        width: 160,
    },
    {
        title: '作者',
        key: 'Artist',
        width: 120,
    },


    {
        title: '作品名称',
        key: 'Title',
        width: 180,
    },
    {
        title: '投票人数',
        key: 'Impre',
        sorter: "default",
    }, {
        title: '投票总数',
        key: 'Total',
        sorter: "default",
    }, {
        title: '投票中位数',
        key: 'Median',
        sorter: "default",
    }, {
        title: '投票平均数',
        key: 'Avg',
        sorter: "default",
    }, {
        title: '注册时间',
        key: 'RegisterDate',
        sorter: "default",
    }, {
        title: '更新时间',
        sorter: "default",
        key: 'UpdateDate',
    }

];
const bofList = ref<Bof[]>([]);
const timeList = ref<SelectOption[]>([])
const rowProps: DataTableCreateRowProps<Bof> = (row) => {
    return {
        onClick() {
            router.push({ path: `https://manbow.nothing.sh/event/event.cgi?action=More_def&num=${row.No}&event=142`, replace: true })
        }
    }
}
async function preload() {
    const { data } = await getBof2023List(searchForm);
    const { data: timers } = await getSelectTimeList("bof/SelectList");
    await loadCharts()
    if (timers) {
        timeList.value = timers.map(e => ({
            label: e.RoundDate,
            value: e.RoundIndex,
        }))
    }
    if (data) {
        bofList.value = data
    }

}
const spec = ref<ISpec>()
async function updateList() {
    const { data } = await getBof2023List(searchForm);
    bofList.value = data
}
async function loadCharts() {
    const { data: charts } = await getChartsData("bof/getChartsData")
    await nextTick();
    if (charts) {
        const ChartsData: Record<string, string | number | null>[] = []
        charts.works.forEach(({ no, name, totals }) => {
            totals.forEach((e, i) => {
                ChartsData.push({
                    no, name,
                    value: e,
                    time: charts.roundsDate[i] || null
                })
            })
        })
        spec.value = {
            title: {
                text: 'BOF前十名投票变动曲线',
            },
            data: {
                values: ChartsData
            },
            type: 'line',
            xField: 'time',
            yField: 'value',
            seriesField: 'no',
            point: {
                visible: false
            },
            line: {
                style: {
                    curveType: 'stepAfter'
                }
            },
            legends: {
                visible: true, position: 'middle', orient: 'bottom',
                item: {
                    label: {
                        formatMethod(e) {
                            return ChartsData.find(item => e === item.no)?.name || ""
                        }
                    }
                }
            },
            tooltip: {
                style: {
                    panel: {
                        // padding: [0, 0, 0, 0]
                    },
                    keyLabel:{
                        maxWidth: 200
                    },
                    valueLabel:{
                        maxWidth: 200
                    }
                },
                dimension: {
                    content: {
                        key: datum => datum?.name,
                        value: datum => datum?.value + "票"
                    }
                },
            }
        };


    }
}
onMounted(() => {
    const render = (s: ISpec) => {
        const vchart = new VChart(s, { dom: 'VchatBox' });
        // 绘制
        vchart.renderAsync();
    }
    if (spec.value) render(spec.value);
    else {
        const stop = watch(spec, () => {
            if (spec.value) {
                render(spec.value)
                stop()
            }
        })
    }

})
preload();

useHead({
    title: "BOF2023会场 - MUGHome",
})
</script>
<style lang="scss" scoped>
.bof2023Header {
    width: 100%;
    height: 345px;
    background-color: #FFFFFF;
    border-radius: 8px;
    overflow: hidden;

    img {
        width: 100%;
        object-fit: cover;
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

.Bof2023Table {
    background-color: #FFFFFF;
    overflow-x: auto;

}

.bof2023 {
    width: 1208px;
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

#VchatBox {
    width: 100%;
    height: 500px;
    padding: 16px;
    border-radius: 16px;
    margin-bottom: 24px;
    background-color: #FFFFFF;
}
</style>
