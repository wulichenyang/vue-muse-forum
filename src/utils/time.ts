// Seconds to 00:00:00 format
const formatSeconds = (times: number) => {
  var result = '00:00:00';
  var hour: any, minute: any, second: any
  if (times > 0) {
    hour = Math.floor(times / 3600);
    if (hour < 10) {
      hour = "0" + hour;
    }
    minute = Math.floor((times - 3600 * hour) / 60);
    if (minute < 10) {
      minute = "0" + minute;
    }

    second = Math.floor((times - 3600 * hour - 60 * minute) % 60);
    if (second < 10) {
      second = "0" + second;
    }
    result = hour + ':' + minute + ':' + second;
  }
  return result;
}

// Get Formatted new Date()
// Return an object:
// date1: "2019年7月14日"
// date2: "2019/7/14"
// date3: "2019年7月14日/15:47:11"
// date4: "15:47:11"
const getTime = () => {
  let now = new Date()
  let year = now.getFullYear() // 年
  let month = now.getMonth() + 1 // 月
  let day = now.getDate() // 日

  let hh = now.getHours() // 时
  let mm = now.getMinutes() // 分
  let ss = now.getSeconds()

  let time = {
    date1: `${year}年${month}月${day}日`,
    date2: `${year}/${month}/${day}`,
    date3: `${year}年${month}月${day}日/${hh}:${mm}:${ss}`,
    time: `${hh}:${mm}:${ss}`
  }
  return time
}

// 本地时间，换算对应格林威治时间
const localDate = (v: Date) => {
  const d = new Date(v || Date.now());
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString();
}

// 获取两日期时间的时间差
type Countdown = { days: number, hours: number, mintues: number, seconds: number }

// 获取两日期时间的时间差
const getCountdown = function (startDate: string | number, endDate: string | number): Countdown {

  var lastDate = Math.ceil(new Date(endDate).getTime() / 1000);
  var now = Math.ceil(new Date(startDate).getTime() / 1000);

  var timeCount = lastDate - now;

  var days = Math.floor(timeCount / (3600 * 24));
  var hours = Math.floor((timeCount - (3600 * 24 * days)) / 3600);
  var mintues = Math.floor((timeCount - (3600 * 24 * days) - (hours * 3600)) / 60);
  var seconds = timeCount - (3600 * 24 * days) - (3600 * hours) - (60 * mintues);

  return {
    days: days,
    hours: hours,
    mintues: mintues,
    seconds: seconds
  }
}

// 日期数字补零
const pad = function (number: number, digits: number) {
  return new Array(Math.max(digits - String(number).length + 1, 0)).join('0') + number;
};

// 获取日期的数组：[年, 月, 日, 时, 分, 秒, 毫秒]
const getDateArray = function (date: number | string): Array<any> {
  const _date = date ? new Date(date) : new Date();
  return [
    _date.getFullYear(),
    pad(_date.getMonth() + 1, 2),
    pad(_date.getDate(), 2),
    pad(_date.getHours(), 2),
    pad(_date.getMinutes(), 2),
    pad(_date.getSeconds(), 2),
    pad(_date.getMilliseconds(), 2)
  ];
}


// 计算两个日期的间隔时间
const dateDiff = function (startDate: string | number, endDate?: string | number): string {

  if (!endDate) endDate = new Date().getTime();

  var start = Math.ceil(new Date(startDate).getTime() / 1000);
  var end = Math.ceil(new Date(endDate).getTime() / 1000);

  var timestamp: number = end - start;
  var time = startDate;

  switch (true) {

    // 一秒内
    case timestamp <= 1:
      time = '刚刚';
      break;

    // 一分钟内
    case timestamp <= 60:
      time = timestamp + '秒前';
      break;

    // 一小时内
    case timestamp <= 3600:
      time = Math.floor(timestamp / 60) + '分钟前';
      break;

    // 一天内
    // case timestamp <= 86400:
    // var hours = Math.floor(timestamp / 3600);
    // var minutes = Math.floor( (timestamp - (3600 * hours) ) / 60 );
    // time = hours + '小时前';
    // var dateArr = getDateArray(startDate);
    // time = '今天 '+dateArr[3]+':'+dateArr[4];
    // break;

    default:
      var dateArr = getDateArray(startDate);
      var nowArr = getDateArray(new Date().getTime());

      // 今天
      if (dateArr[0] == nowArr[0] && dateArr[1] == nowArr[1] && nowArr[2] == dateArr[2]) {
        time = '今天 ' + dateArr[3] + ':' + dateArr[4];
      } // 昨天
      else if (dateArr[0] == nowArr[0] && dateArr[1] == nowArr[1] && parseInt(nowArr[2]) - parseInt(dateArr[2]) == 1) {
        time = '昨天 ' + dateArr[3] + ':' + dateArr[4];
      } // 前天
      else if (dateArr[0] == nowArr[0] && dateArr[1] == nowArr[1] && parseInt(nowArr[2]) - parseInt(dateArr[2]) == 2) {
        time = '前天 ' + dateArr[3] + ':' + dateArr[4];
      } // 同年内
      else if (dateArr[0] == nowArr[0]) {
        time = Math.floor(dateArr[1]) + '月' + Math.floor(dateArr[2]) + '日 ' + dateArr[3] + ':' + dateArr[4];
      } // 不同年
      else {
        time = dateArr[0] + '年' + dateArr[1] + '月' + dateArr[2] + '日';
      }
  }

  return time;
}


export {
  formatSeconds,
  getTime,
  dateDiff,
  localDate,
  getDateArray,
  getCountdown,

}