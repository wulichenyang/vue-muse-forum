import NodeRSA from "node-rsa"
/**
 * 客户端加密密码
 * 
 * @param {string} pwd - 用户密码
 * @param {string} publicKey - 公钥
 * @return {string} decryptedPwd - 加密后的密码
 */
export const encryptPwd = (pwd: string, publicKey: string): string => {
  let pubKey = new NodeRSA(publicKey, 'pkcs8-public');
  var encryptedPwd = pubKey.encrypt(pwd, 'base64');
  return encryptedPwd;
}
