/** 菜单类型 */
export type ROUTE_TYPE = 'MENU' | 'CATA' | 'BUTTON' | 'ROOT';
export enum ROUTE_TYPE_ENUM {
  MENU = 'MENU',
  CATA = 'CATA',
  BUTTON = 'BUTTON',
  ROOT = 'ROOT'
}
export const ROUTE_TYPE_LABEL: { [key in ROUTE_TYPE]: string } = {
  ROOT: '根目录',
  MENU: '菜单',
  CATA: '目录',
  BUTTON: '按钮'
};
/** 菜单类型对应法则 */
export const ROUTE_TYPE_FX: { [key in ROUTE_TYPE]: ROUTE_TYPE[] } = {
  ROOT: ['MENU', 'CATA'],
  MENU: ['BUTTON'],
  CATA: ['MENU'],
  BUTTON: []
};
