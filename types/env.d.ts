/** 声明 vite 环境变量的类型（如果未声明则默认是 any） */
declare interface ImportMetaEnv {
  readonly VITE_GLOB_PUBLIC_PATH: string;
  readonly VITE_GLOB_APP_NAME: string;
  readonly VITE_GLOB_ROUTER_MODE: 'hash' | 'history';
  readonly VITE_GLOB_API_URL: string;
  readonly VITE_GLOB_API_URL_TIKTOK: string;
  readonly VITE_GLOB_SSE_URL: string;
  readonly VITE_GLOB_ERROR_MONITOR: string;
  readonly VITE_GLOB_WEB_SOCKET: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
