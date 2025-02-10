import { UpcTestingStatus } from '@/api/system/upcTesting';
import { ElText } from 'element-plus';
import moment from 'moment-timezone';
import { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

export const tableColumns: TableColumnProps[] = [
  {
    label: '#',
    width: 50,
    align: 'center',
    type: 'index'
  },
  {
    label: '任务ID',
    minWidth: 240,
    align: 'center',
    prop: 'taskId',
    showOverflowTooltip: true
  },
  {
    label: '创建时间',
    prop: 'createTime',
    minWidth: 180,
    align: 'center'
  },
  {
    label: '状态',
    prop: 'status',
    align: 'center',
    minWidth: 120
  },
  {
    label: 'UPC总数',
    prop: 'total',
    align: 'center',
    width: 100,
    formatter: (_row, _column, cellValue) => {
      return h('b', {}, cellValue);
    }
  },
  {
    label: '未用过',
    prop: 'unused',
    align: 'center',
    width: 100,
    formatter: (_row, _column, cellValue) => {
      return h(
        ElText,
        { type: 'success', style: { fontWeight: 'bold' } },
        {
          default: () => cellValue
        }
      );
    }
  },
  {
    label: '已用过',
    prop: 'used',
    align: 'center',
    width: 100,
    formatter: (_row, _column, cellValue) => {
      return h(
        ElText,
        { type: 'danger', style: { fontWeight: 'bold' } },
        {
          default: () => cellValue
        }
      );
    }
  },
  {
    label: '耗时',
    prop: 'duration',
    align: 'center',
    minWidth: 120,
    formatter: (row, _column, _cellValue) => {
      if (row.taskStartTime && row.taskEndTime) {
        const duration = moment.duration(moment(row.taskEndTime).diff(moment(row.taskStartTime)));
        const totalTime = `${duration.minutes()} 分 ${duration.seconds()} 秒`;
        return totalTime;
      } else {
        return '-';
      }
    }
  },
  {
    label: '创建人',
    prop: 'username',
    align: 'center',
    minWidth: 180
  },
  {
    label: '更新时间',
    align: 'center',
    minWidth: 180,
    prop: 'updateTime'
  },
  {
    label: '操作',
    align: 'center',
    width: 100,
    prop: 'action'
  }
];

export const statusMap: Record<
  UpcTestingStatus,
  { type: 'info' | 'error' | 'success'; text: string }
> = {
  SUCCESS: {
    type: 'success',
    text: '成功'
  },
  ERROR: {
    type: 'error',
    text: '失败'
  },
  RUNNING: {
    type: 'info',
    text: '运行中'
  }
};
