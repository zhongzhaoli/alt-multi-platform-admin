export interface ConfirmDialogProps {
  modelValue: boolean;
  title?: string;
  alignCenter?: boolean;
  width?: string | number;
  confirmBtnText?: string;
  cancelBtnText?: string;
  submitLoading?: boolean;
  showClose?: boolean;
  showConfirmBtn?: boolean;
  showCancelBtn?: boolean;
}
