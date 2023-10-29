<template>
    <n-popselect :options="options" trigger="click" @update:value="changeLanguage">
        <nav class="i18n-icon flex items-center">
            <img src="@/assets/icon/language.svg" alt="" />
        </nav>
    </n-popselect>
</template>

<script lang="ts" setup>
import { computed, inject, reactive } from 'vue';
import type { App } from "@/App.vue"
import { useI18n } from 'vue-i18n';
const app = inject<App>("app")
const { t } = useI18n();
const options = reactive([
    { label: computed(() => t('component.i18n.options[1]')), value: 'zh-cn' },
    { label: computed(() => t('component.i18n.options[0]')), value: 'en-us' }])
function changeLanguage(lang: App["locale"]) {
    app?.setLocale(lang)
}
</script>
<style lang="scss" scoped>
.i18n-icon {
    height: 100%;
    cursor: pointer;

    img {
        height: 40%;
    }
}
</style>