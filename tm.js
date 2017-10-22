const formAPI = require('./tools/formapi');
const Config = require('./config/api');
const request = require('request');

request.debug = true;

function listFile(bucket, obj) {
    var targetPath = obj.path||'/'
    var uri = '/' + bucket + targetPath
    var url = Config.upyun.API_URL + uri;

    var header = formAPI.getAuth(uri, 'GET');

    request({
        url:url,
        method:'GET',
        headers : {
            'User-Agent': 'request/2.83.0',
            'Date' : (new Date).toGMTString(),
            'Authorization' : header,
            'x-list-limit' : 5
        },
        timeout: 15000
    }, function(err, response, body) {
        console.log('Headers:', response.headers);
        console.log('Body:', body)
    });
}

listFile('miniprogram', {
    paht:'/'
});