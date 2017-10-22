const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
/**
 * error code 说明.
 * <ul>
 *    <li>-40001: 签名验证错误</li>
 *    <li>-40002: xml解析失败</li>
 *    <li>-40003: sha加密生成签名失败</li>
 *    <li>-40004: encodingAesKey 非法</li>
 *    <li>-40005: appid 校验错误</li>
 *    <li>-40006: aes 加密失败</li>
 *    <li>-40007: aes 解密失败</li>
 *    <li>-40008: 解密后得到的buffer非法</li>
 *    <li>-40009: base64加密失败</li>
 *    <li>-40010: base64解密失败</li>
 *    <li>-40011: 生成xml失败</li>
 * </ul>
 */
const parser = new xml2js.Parser();
function parseEnXML(filename, fn) {
    fs.readFile(path.resolve(__dirname, filename), (err, data) => {
        if(err==null) {
            parser.parseString(data, (err2, res) => {
                if(err2) {
                    return fn&&fn(err2, null);
                }

                let ToUserName = res.xml.ToUserName[0].trim();
                let Encrypt = res.xml.Encrypt[0].trim();

                fn&&fn(null, {
                    ToUserName:ToUserName,
                    Encrypt:Encrypt
                });
            })
        } else {
            // console.log('FS ERR->', err);
            throw err;
        }
    })
}


parseEnXML('data/img.xml', (err, data) => {
    console.log('OK->', err, data);
})