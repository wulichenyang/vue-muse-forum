/**
 * 从html字符串中，获取所有图片地址
 * @param  {string} html [html 内容]
 * @return {[type]}      [description]
 */
const abstractImagesFromHTML = (str: string) => {

  let imgReg = /<img(?:(?:".*?")|(?:'.*?')|(?:[^>]*?))*>/gi;
  let srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
  let result = [];
  let img;

  while (img = imgReg.exec(str)) {
    let _img = img[0].match(srcReg);
    if (_img && _img[1]) result.push(_img[1]);
  }

  return result
}


/**
 * 从html字符串中，去除图片和标签，用户文章简单信息展示
 * @param  {string} html [html 内容]
 * @return {[type]}      [html 去除图片的内容]
 */
const htmlToString = (html: string) => {

  let imgReg = /<img(.*?)>/gi;
  let imgs = [];
  let img;

  while (img = imgReg.exec(html)) {
    imgs.push(img[0]);
  }

  imgs.map(item => {
    html = html.replace(item, '[图片] ');
  });

  // 删除所有html标签
  html = html.replace(/<[^>]+>/g, "");
  return html;

}



/**
 * 从html字符串中，去除图片 img to [图片]
 * @param  {string} html [html 内容]
 * @return {[type]}      [html 去除图片的内容]
 */
const htmlImgToText = (html: string) => {

  let imgReg = /<img(.*?)>/gi;
  let imgs = [];
  let img;

  while (img = imgReg.exec(html)) {
    imgs.push(img[0]);
  }

  imgs.map(item => {
    html = html.replace(item, '[图片] ');
  });

  // 删除所有html标签
  // html = html.replace(/<[^>]+>/g,"");

  return html;
}

// 用正则表达式实现html编码（转义）
const html2Escape = (sHtml: string) => {
  return sHtml.replace(/[<>&"]/g, (c) => {
    return ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' } as any)[c];
  });
}

// 用正则表达式实现html解码（反转义）
const escape2Html = (str: string) => {
  var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
  return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, (all, t) => {
    return (arrEntities as any)[t];
  });
}

export {
  abstractImagesFromHTML,
  htmlToString,
  htmlImgToText,
  html2Escape,
  escape2Html,
}