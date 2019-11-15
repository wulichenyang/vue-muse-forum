/**
 * 用户id哈希到默认头像编号 [1, maxNum]
 * @param {String} id 用户id
 * @param {Number} maxNum 最大编号值
 */
export const hashId2DetaultAvatar = (id: string, maxNum: number = 1)=> {
  let arr = id.split('')
  arr = arr.map((c)=>(c as any).charCodeAt())
  let sum = arr.reduce((sum: any, cur: any) => {
    return sum + cur
  }, 0)
  return (sum % maxNum) + 1;
}