<script setup lang="ts">
import { computed, provide, reactive, watch } from 'vue';
import { zhCN, enUS, dateZhCN, dateEnUS, useMessage, useNotification } from 'naive-ui';
import { useAppload, useApploadData } from './utils/useAppload';
import dayjs from "dayjs/esm";
import { useI18n } from 'vue-i18n';
import date_zhCn from 'dayjs/esm/locale/zh-cn';
import date_en from 'dayjs/esm/locale/en';

export interface App {
    locale: "zh-cn" | "en-us";
    setLocale: (locale: App["locale"]) => void;
}

const setting = reactive<App>({
    locale: "zh-cn",
    setLocale(locale) {
        setting.locale = locale;
        dayjs.locale(setting.locale === "zh-cn" ? date_zhCn : date_en);
        i18n.locale.value = setting.locale;
        localStorage.setItem("local", locale)
    }
});
const i18n = useI18n();
const locale = computed(() => setting.locale === "zh-cn" ? zhCN : enUS)
const dateLocale = computed(() => setting.locale === "zh-cn" ? dateZhCN : dateEnUS);
Object.assign(setting, useApploadData())
setting.setLocale(setting.locale)
provide("app", setting);


const themeOverrides = {
    common: {
        primaryColor: '#FF0000'
    }
}
</script>

<template>
    <n-config-provider :theme-overrides="themeOverrides" abstract :locale="locale" :date-locale="dateLocale">
        <n-loading-bar-provider>
            <n-notification-provider>
                <n-message-provider>
                    <n-dialog-provider>
                        <useAppload />
                        <RouterView />
                    </n-dialog-provider>
                </n-message-provider>
            </n-notification-provider>
        </n-loading-bar-provider>

    </n-config-provider>
</template>

<style scoped></style>
