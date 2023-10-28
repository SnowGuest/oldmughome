<script setup lang="ts">
import { computed, provide, reactive, watch } from 'vue';
import { zhCN, enUS, dateZhCN, dateEnUS } from 'naive-ui';
import { useAppload } from './utils';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
import useHeader from "@/components/useHeader.vue"
interface Setting {
    locale: "zh-cn" | "en-us";
}
const setting = reactive<Setting>({
    locale: "zh-cn",
});
const i18n = useI18n();

const locale = computed(() => setting.locale === "zh-cn" ? zhCN : enUS)
const dateLocale = computed(() => setting.locale === "zh-cn" ? dateZhCN : dateEnUS);
watch(setting, () => {
    dayjs.locale(setting.locale);
    i18n.locale.value = setting.locale
})
provide("app", setting);
useAppload()
</script>

<template>
    <n-config-provider abstract :locale="locale" :date-locale="dateLocale">
        <n-notification-provider>
            <n-message-provider>
                <useHeader />
            </n-message-provider>
        </n-notification-provider>
    </n-config-provider>
    <useHeader />
    
</template>

<style scoped></style>
