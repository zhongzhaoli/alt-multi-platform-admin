type FormType =
  | "input"
  | "select"
  | "selectMultiple"
  | "date"
  | "multiple"
  | "dateRange";

export interface FilterColumnsProp {
  label: string;
  prop: string;
  type?: FormType;
  col?: number;
  placeholder?: string;
  prefixKey?: string;
  prefixWidth?: number;
  prefixSelectOptions?: FilterSelectOptionsProp[];
  selectOptionsFun?: () => FilterSelectOptionsProp[];
  selectOptions?: FilterSelectOptionsProp[];
  startKey?: string;
  endKey?: string;
}

export interface FilterSelectOptionsProp<T = string, V = any> {
  label: T;
  value: V;
}
