// Seconds to 00:00:00 format
const formatSeconds = (times: number) => {
  var result = '00:00:00';
  var hour: any, minute: any, second: any
  if (times > 0) {
    hour = Math.floor(times / 3600);
    if (hour < 10) {
      hour = "0"+hour;
    }
    minute = Math.floor((times - 3600 * hour) / 60);
    if (minute < 10) {
      minute = "0"+minute;
    }

    second = Math.floor((times - 3600 * hour - 60 * minute) % 60);
    if (second < 10) {
      second = "0"+second;
    }
    result = hour+':'+minute+':'+second;
  }
  return result;  
}

// Get Formatted new Date()
// Return an object:
// date1: "2019年7月14日"
// date2: "2019/7/14"
// date3: "2019年7月14日/15:47:11"
// date4: "15:47:11"
const getTime = ()  => {
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

export {
  formatSeconds,
  getTime,
  localDate,
}