import 'normalize.css'
import './assets/css/main.css'
import 'vfonts/Lato.css'
import 'md-editor-v3/lib/style.css';
import 'virtual:uno.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import enUS from "./locales/en-us.json";
import zhCn from './locales/zh-cn.json';
import dayjs from 'dayjs/esm';

import date_zhCn from 'dayjs/esm/locale/zh-cn';
import localeData from 'dayjs/esm/plugin/localeData'
import relativeTime from "dayjs/esm/plugin/relativeTime";
import { createHead } from '@unhead/vue'
import 'boxicons';
import 'default-passive-events';
const head = createHead()
type MessageSchema = typeof zhCn
const i18n = createI18n<[MessageSchema], "zh-cn" | "en-us">({
  locale: "zh-cn",
  legacy: false,
  messages: {
    "zh-cn": zhCn,
    "en-us": enUS
  },
})
dayjs.locale(date_zhCn) // 全局使用
dayjs.extend(relativeTime)
dayjs.extend(localeData)

const app = createApp(App)
app.use(head)
app.use(i18n)
app.use(createPinia())
app.use(router)
app.mount('#root')
