
const Config = require('../config/api').upyun;
const crypto = require('crypto');
const encrypt = require('./encrypt');
/*
 * saveKey 存储的路径 /demo.jpg
 * bucket 存储的Bucket
 */
function genPolicy(fileName, bucket=false, contentMd5 = false) {
    let sec = Math.round(Date.now()/1000) + 3600;
    let obj = {
        'bucket' : bucket||Config.bucket,
        'save-key' : '/' + fileName, // '/demo.jpg'
        'expiration' : sec,
        'date' : (new Date).toGMTString()
    };
    if(contentMd5) {
        obj['content-md5'] = contentMd5;
    }
    return encrypt.base64_encode(JSON.stringify(obj));
}

/*
 * 为Form 上传生成签名
 */
function genSign(saveKey, bucket=false, method='post') {

    const hmac = crypto.createHmac('sha1', encrypt.md5(Config.password));

    let met = method.toUpperCase()||'POST';

    let policy = genPolicy(saveKey);

    let URI = '/' + (bucket||Config.bucket);

    let date = (new Date).toGMTString();

    hmac.update([met, URI, date, policy].join('&'));

    return hmac.digest('base64');

}

/*
 * 获取签名认证：
 * Authorization: UPYUN admin:<Signature>
 * <Signature> = Base64(HMAC-SHA1 (<Password>,
 * <Method>&
 * <URI>&
 * <Date>&
 * <Content-MD5>
 * ))
 */
 function getAuth(uri, method = 'GET',  operator='admin', password = 'xdxd1078') {

    const hmac = crypto.createHmac('sha1', encrypt.md5(password));
    
    let met = method||'GET';
    
    let date = (new Date).toGMTString();
    
    hmac.update([met, uri, date].join('&'));

    return 'UPYUN ' + operator + ':' + hmac.digest('base64');
 }

 function parseList(text) {
     var Li01 = text.split(/\n/g);
     return Li01.map(n => {
         return n.split(/\t/g);
     });
 }

module.exports = {
    genPolicy,
    genSign,
    getAuth,
    parseList
};