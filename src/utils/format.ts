/**
 * 格式化数字大小, 输出成带单位的字符串，k/w/
 * @param {Number} size 数量大小
 * @param {Number} [pointLength=2] 精确到的小数点数。
 */
const formatNumber = (size: number, pointLength?: number, units?: string[]) => {
  if (size >= 1000) {
    return (size / 1000).toFixed(pointLength === undefined ? 1 : pointLength) + 'k'
  }
  return size
}

export {
  formatNumber
}