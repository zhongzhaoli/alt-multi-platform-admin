/** 声明 vite 环境变量的类型（如果未声明则默认是 any） */
declare interface ImportMetaEnv {
  readonly VITE_GLOB_API_URL: string;
  readonly VITE_NODE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
