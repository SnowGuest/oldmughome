<script setup lang="ts">
import { computed, provide, reactive, watch } from 'vue';
import { zhCN, enUS, dateZhCN, dateEnUS, useMessage, useNotification } from 'naive-ui';
import { useAppload, useApploadData } from './utils/useAppload';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';
export interface App {
    locale: "zh-cn" | "en-us";
    setLocale: (locale: App["locale"]) => void;
}

const setting = reactive<App>({
    locale: "zh-cn",
    setLocale(locale) {
        setting.locale = locale;
        dayjs.locale(setting.locale);
        i18n.locale.value = setting.locale
    }
});
const i18n = useI18n();

const locale = computed(() => setting.locale === "zh-cn" ? zhCN : enUS)
const dateLocale = computed(() => setting.locale === "zh-cn" ? dateZhCN : dateEnUS);

provide("app", setting);
useApploadData()
// #F5A91D
const themeOverrides = {
    common: {
        primaryColor: '#FF0000'
    },

}
</script>

<template>
    <n-config-provider :theme-overrides="themeOverrides" abstract :locale="locale" :date-locale="dateLocale">
        <n-loading-bar-provider>
            <n-notification-provider>
                <n-message-provider>
                    <useAppload />
                    <RouterView />
                </n-message-provider>
            </n-notification-provider>
        </n-loading-bar-provider>

    </n-config-provider>
</template>

<style scoped></style>
