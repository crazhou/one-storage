
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

module.exports = {
    genPolicy,
    genSign
};