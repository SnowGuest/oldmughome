/// <reference types="vite/client" />
import type { MessageApiInjection } from "naive-ui/es/message/src/MessageProvider";
import type { NotificationApiInjection } from "naive-ui/es/notification/src/NotificationProvider";
interface ImportMetaEnv {
  readonly VITE_FETCH_URL: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}


declare global {
  interface Window {
    Nmessage: MessageApiInjection;
    Nnotification: NotificationApiInjection;
  }
}