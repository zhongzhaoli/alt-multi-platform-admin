import moment from 'moment-timezone';

// 时间转化
export function getTimezoneTime(timezone = 'America/Los_Angeles', format = 'YYYY-MM-DD HH:mm:ss') {
  const now = moment();
  const newDateObject = now.tz(timezone);
  return newDateObject.format(format);
}

// 原有时间转化成目标时区的Date对象
export function getTargetTimezoneDate(unix: number, timezone = 'America/Los_Angeles') {
  const newDateObject = moment(unix).tz(timezone);
  return new Date(newDateObject.format('YYYY-MM-DD HH:mm:ss'));
}
