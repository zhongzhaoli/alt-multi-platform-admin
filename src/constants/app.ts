import { getAppEnvConfig } from '@/utils/env';
import { sortBy, uniq } from 'lodash-es';
const { VITE_GLOB_APP_NAME } = getAppEnvConfig();

// 侧边栏打开状态常量
export const SIDEBAR_OPENED: boolean = true;
// 侧边栏关闭状态常量
export const SIDEBAR_CLOSED: boolean = false;

// 项目名称
export const PROJECT_NAME: string = VITE_GLOB_APP_NAME;

// 语言
export type LANGUAGE = 'zh' | 'en';
export const DEFAULT_LANGUAGE: LANGUAGE = 'zh';

// Element Size
export type ELEMENT_UI_SIZE = 'large' | 'small' | 'default';
// Table Size
export const TABLE_SIZE: ELEMENT_UI_SIZE = 'default';
// Avatar Shape
export type AVATAR_SHAPE = 'circle' | 'square';
export const DEFAULT_AVATAR_SHAPE: AVATAR_SHAPE = 'circle';

/** Pagination Layout */
export const PAGINATION_LAYOUT: string = 'total, sizes, prev, pager, next, jumper';
// Pagination 默认页码
export const PAGE_SIZE: number = 20;
// Pagination 默认页数
export const PAGE: number = 1;
// Pagination 页码列表
export const PAGE_SIZES: ReadonlyArray<number> = sortBy(uniq([PAGE_SIZE, 10, 20, 50, 100]));

// 保存密码 Storage
export const SAVED_USER_KEY: string = 'SAVED_USER';
