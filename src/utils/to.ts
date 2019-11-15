// 捕获 Promise 里的错误，以[err, data]形式返回
// Use Case：let err, res;
// [err, res] = await to(getUser())
// if(err) {}
// handle res...
module.exports = function to(promise: Promise<any>) {
  // // 检测是否是 Promise 对象
  // if (!promise || !Promise.prototype.isPrototypeOf(promise)) {
  //   return new Promise((resolve, reject) => {
  //     reject(new Error("Require promise as the param"));
  //   }).catch((err) => {
  //     return [err, null];
  //   });
  // }

  return promise.then(data => {
    return [null, data];
  })
    .catch(err => [err]);
}