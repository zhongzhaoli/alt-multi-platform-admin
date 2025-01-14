export type FilterTypes = 'input' | 'select' | 'date' | 'dateRange';

interface BaseFilterColumnProps {
  label: string;
  prop: string;
  type: FilterTypes;
  width?: number;
  placeholder?: string;
  // 是否多选 select/input
  multiple?: boolean | SelectMultipleColumnProps;
  // 是否显示前缀下拉切换 all
  prefixSelect?: PrefixSelectProps;
}

// Input的额外类型
export interface InputColumnProps extends BaseFilterColumnProps {
  type: 'input';
  multiple?: boolean;
  arrayHandle?: (arr: any[]) => any;
}

// DateRange的额外类型
export interface DateRangeColumnProps extends BaseFilterColumnProps {
  type: 'dateRange';
  startKey?: string;
  endKey?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  rangeSeparator?: string;
}

// Date的额外类型
export interface DateColumnProps extends BaseFilterColumnProps {
  type: 'date';
}

interface FilterSelectOptionsProp<T = string, P = any> {
  label: T;
  value: P;
}
export interface SelectColumnProps extends BaseFilterColumnProps {
  type: 'select';
  selectOptions: FilterSelectOptionsProp[] | (() => FilterSelectOptionsProp[]);
  arrayHandle?: (arr: any[]) => any;
}

// Select Multiple的额外类型
export interface SelectMultipleColumnProps {
  multipleLimit?: number;
  collapseTags?: boolean;
}

// 前缀下拉切换的类型
export interface PrefixSelectOptionProps extends FilterSelectOptionsProp {}
export interface PrefixSelectProps {
  options: PrefixSelectOptionProps[] | (() => PrefixSelectOptionProps[]);
  width?: number;
}

// Column Props
export type FilterColumnProps =
  | InputColumnProps
  | DateRangeColumnProps
  | SelectColumnProps
  | DateColumnProps;

// Component Props
export interface FilterContainerComponentProps {
  modelValue: Record<string, any>;
  columns: FilterColumnProps[];
  submitFun?: (data: Record<string, any>) => void;
  resetFun?: () => void;
}
