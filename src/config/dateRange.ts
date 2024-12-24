export const shortcuts = [
  {
    text: '今天',
    value: () => {
      const startEnd = new Date();
      return [startEnd, startEnd];
    }
  },
  {
    text: '昨天',
    value: () => {
      const startEnd = new Date();
      startEnd.setDate(startEnd.getDate() - 1);
      return [startEnd, startEnd];
    }
  },
  {
    text: '最近7天',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: '最近30天',
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  }
];
