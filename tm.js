const formAPI = require('./tools/formapi');
const Config = require('./config/api');
const request = require('request');

// request.debug = true;

function listFile(bucket, obj, fn) {
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
            'x-list-limit' : obj.pageSize||20,
            'x-list-order' : obj.order||'asc',
            'x-list-iter' : obj.page||1
        },
        timeout: 15000
    }, function(err, response, body) {
        // lastPage g2gCZAAEbmV4dGQAA2VvZg
        var pageIter = response.headers['x-upyun-list-iter'];
        if(!err && response.statusCode === 200) {
            fn&&fn({
                nextPage:pageIter,
                fileList:formAPI.parseList(body)
            });
        }
    });
}

listFile('miniprogram', {
    path:'/',
    order:'asc',
    pageSize:10
}, function(resp) {
    console.log('RESP->', resp);
});