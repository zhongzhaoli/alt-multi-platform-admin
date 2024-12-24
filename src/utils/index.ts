import { dayjs, ElLoading, ElMessage, ElTooltip } from 'element-plus';
import { flatMapDeep } from 'lodash-es';
import { Ref, unref, h } from 'vue';

// JSON返回时间格式处理
export function jsonDateTimeFormat(date: string): string {
  if (!date) return '';
  try {
    const list = date.split('T');
    if (list.length > 1) {
      return `${list[0]} ${list[1]}`;
    } else {
      return date.split('Z')[0];
    }
  } catch (_err) {
    return date;
  }
}

// 请求成功数据时间处理
const needFormatKey = ['create_time', 'update_time', 'create_time_us'];
export function dateTimeInterceptor(data: { [key: string]: any }): object {
  if (!data) return data;
  Object.keys(data).forEach((key) => {
    if (needFormatKey.includes(key)) {
      data[key] = jsonDateTimeFormat(data[key]);
    }

    if ((key === 'data' || key === 'children') && Array.isArray(data[key])) {
      data[key] = (data[key] as Array<{ [key: string]: any }>).map((item) =>
        dateTimeInterceptor(item)
      );
    }
  });
  return data;
}

// 判断当前时间段
type TimePeriod = 'morning' | 'afternoon' | 'night';
export const timePeriodZh: { [key in TimePeriod]: string } = {
  morning: '早上好',
  afternoon: '下午好',
  night: '晚上好'
};
export function nowTimePeriod(): 'morning' | 'afternoon' | 'night' {
  const currentHour = new Date().getHours();
  if (currentHour >= 6 && currentHour < 12) {
    return 'morning';
  } else if (currentHour >= 12 && currentHour < 19) {
    return 'afternoon';
  } else {
    return 'night';
  }
}

// 获取时间范围数据
export function getTimeRangeData<T extends string>(
  list: [Date, Date] | undefined,
  startKey: T = 'task_date_start' as T,
  endKey: T = 'task_date_end' as T
): Record<T, string> {
  if (!list || !list.length) return { [startKey]: '', [endKey]: '' } as Record<T, string>;

  const [task_date_start, task_date_end] = list;

  return {
    [startKey]: task_date_start ? dayjs(task_date_start).format('YYYY-MM-DD') : '',
    [endKey]: task_date_end ? dayjs(task_date_end).format('YYYY-MM-DD') : ''
  } as Record<T, string>;
}

// 下载
export const downloadFile = async (fileHref: string, fileName: string) => {
  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(255, 255, 255, 0.5)'
  });
  try {
    const response = await fetch(fileHref);
    const blob = await response.blob();
    downloadCore(blob, fileName);
  } catch (err) {
    console.log(err);
    ElMessage.error('文件下载失败');
  } finally {
    loading.close();
  }
};

// 生成当前时间的可视化数字
export const generateVisualNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();
  return `${year}${String(month).padStart(2, '0')}${String(date).padStart(2, '0')}${String(hours).padStart(2, '0')}${String(minutes).padStart(2, '0')}${String(seconds).padStart(2, '0')}${milliseconds}`;
};

// 下载核心
export const downloadCore = async (blob: Blob, fileName: string) => {
  // 创建下载链接
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  // 释放 Blob URL
  window.URL.revokeObjectURL(url);
};

// 复制文本
export const copyText = async (
  text: string,
  successText = '复制成功',
  errorText = '复制失败，请手动复制（检查浏览器复制权限或HTTPS证书）'
) => {
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    ElMessage.success(successText);
  } catch (_err) {
    ElMessage.error(errorText);
  }
};

// 复制icon
export const RenderCopyIcon = (props: {
  text: string;
  title: string;
  showAfter?: number;
  margin?: 'l' | 'r';
  type?: 'primary';
}) => {
  const { text, title, showAfter = 150, margin, type = undefined } = props;
  return h(
    ElTooltip,
    { showAfter, content: `复制 ${title}` },
    {
      default: () =>
        h(
          'span',
          {
            class: {
              renderCopyIcon: true,
              ml: margin === 'l',
              mr: margin === 'r',
              primary: type && type === 'primary'
            },
            onClick: () => copyText(text)
          },
          [h('i', { class: 'ri-file-copy-2-line' })]
        )
    }
  );
};

// ref对象查询某个key
export function findRefKey(refObject: Ref, key: string, defaultValue = {}) {
  if (!unref(refObject)) return defaultValue;
  if (!Object.prototype.hasOwnProperty.call(unref(refObject), key)) return defaultValue;
  if (!unref(refObject)[key]) return defaultValue;
  return unref(refObject)[key];
}

// 打平嵌套数组对象
export const flattenNestedArray = <T>(array: any[], childrenKey: string): T[] => {
  return flatMapDeep(array, (item: any) => [
    item,
    ...(item[childrenKey] ? flattenNestedArray(item[childrenKey], childrenKey) : [])
  ]);
};
