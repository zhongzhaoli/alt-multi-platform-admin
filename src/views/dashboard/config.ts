import { ListItemProps } from '@/api/dashboard';
import { EChartsOption } from 'echarts';
import { TableColumnProps } from 'tsx-element-table';
import { h } from 'vue';

// 时间颗粒度
interface GranularityProps {
  label: string;
  value: string;
}
// 1<=x<7
export const levelOneGranularity: GranularityProps[] = [
  {
    label: '小时',
    value: 'hour'
  },
  {
    label: '天',
    value: 'day'
  }
];
// 7<=x<360
export const levelTwoGranularity: GranularityProps[] = [
  {
    label: '小时',
    value: 'hour'
  },
  {
    label: '天',
    value: 'day'
  },
  {
    label: '周',
    value: 'week'
  }
];
// 31<=x<360
export const levelThreeGranularity: GranularityProps[] = [
  {
    label: '小时',
    value: 'hour'
  },
  {
    label: '天',
    value: 'day'
  },
  {
    label: '周',
    value: 'week'
  },
  {
    label: '月',
    value: 'month'
  }
];
// 360<=x
export const levelFourGranularity: GranularityProps[] = [
  {
    label: '小时',
    value: 'hour'
  },
  {
    label: '月',
    value: 'month'
  },
  {
    label: '季度',
    value: 'quarter'
  }
];

export const generateOptions = (
  series: ListItemProps[],
  history: ListItemProps[]
): EChartsOption => {
  return {
    xAxis: {
      type: 'category',
      data: series.map((item) => item.xText),
      axisLine: {
        lineStyle: {
          color: '#dce1ee'
        }
      },
      axisTick: {
        alignWithLabel: true,
        lineStyle: {
          color: '#dce1ee'
        }
      },
      axisLabel: {
        color: '#616161'
      }
    },
    yAxis: {
      type: 'value'
    },
    grid: {
      left: 60,
      right: 30,
      top: 10,
      bottom: 30
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: '#eaeaea'
        }
      },
      formatter: (params: any) => {
        let rowsText: string = '';
        for (let index = 0; index < params.length; index++) {
          const row = params[index];
          const { desc, value } = row.data;
          rowsText += `<div>${row.marker}${desc}：<b>$ ${value}</b></div>`;
        }
        return `<div style='font-size: 13px;'>${rowsText}</div>`;
      }
    },
    series: [
      {
        name: '环比',
        lineStyle: {
          color: '#a8cafd',
          type: 'dashed'
        },
        itemStyle: {
          borderWidth: 0,
          color: '#a8cafd'
        },
        data: history,
        type: 'line',
        smooth: true
      },
      {
        name: '当前',
        lineStyle: {
          color: '#267afa'
        },
        itemStyle: {
          borderWidth: 0,
          color: '#267afa'
        },
        data: series,
        type: 'line',
        smooth: true
      }
    ]
  };
};

export const tableColumns: TableColumnProps[] = [
  {
    label: '产品信息',
    prop: 'productInfo',
    minWidth: 240
  },
  {
    label: '店铺名称',
    prop: 'shop_name',
    width: 180,
    align: 'center'
  },
  {
    label: '商品销售额(不含税)',
    prop: 'sales_amount',
    width: 180,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$ ${cellValue}`);
    }
  },
  {
    label: '已支付金额(含税)',
    prop: 'paid_amount',
    width: 180,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$ ${cellValue}`);
    }
  },
  {
    label: '已售出',
    prop: 'sold_out',
    width: 160,
    align: 'center'
  },
  {
    label: '已支付订单数',
    prop: 'paid_order_num',
    width: 160,
    align: 'center'
  },
  {
    label: '客单价(已支付)',
    prop: 'paid_unit_price',
    width: 160,
    align: 'center',
    formatter: (_row, _column, cellValue) => {
      return h('b', null, `$ ${cellValue}`);
    }
  },
  {
    label: '买家数(已支付)',
    prop: 'paid_buyer_num',
    width: 160,
    align: 'center'
  },
  {
    label: '退货数',
    prop: 'return_num',
    width: 160,
    align: 'center'
  }
];
