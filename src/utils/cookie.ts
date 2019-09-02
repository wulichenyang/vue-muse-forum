// 封装cookie的操作

function getCookie(key: string) {
  if (document.cookie) {
    let cookieArr = document.cookie.split('; ');
    for (let i = 0; i < cookieArr.length; i++) {
      let keyArr = cookieArr[i].split("=");
      if (keyArr[0] === key) {
        return decodeURI(keyArr[1])
      }
    }
  } else {
    return ''
  }
}

function setCookie(name: string, val: string, hour: number) {
  // 毫秒ms
  let expHour = hour * 60 * 60 * 1000;
  let expireDate: any = new Date();
  expireDate.setTime(expireDate.getTime() + expHour);
  document.cookie = `${name}=${encodeURI(val)}; expires=${expireDate.toGMTString()}; path=/`;
}

function removeCookie(name: string) {
  setCookie(name, "", -24);
}

const cookie = {
  setCookie,
  getCookie,
  removeCookie
};

export default cookie