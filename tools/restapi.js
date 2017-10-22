const formAPI = require('./tools/formapi');
const Config = require('./config/api');
const request = require('request');

function fileInfo(bucket, file, fn) {
    var uri = '/' + bucket + '/' + file;
    var url = Config.upyun.API_URL + uri;
    var header = formAPI.getAuth(uri, 'HEAD');

    request({
        url:url,
        method:'HEAD',
        timeout:15000,
        headers:{
            'User-Agent': 'request/2.83.0',
            'Date' : (new Date).toGMTString(),
            'Authorization' : header
        }
    }, function(error, response, body){
        var headers = response.headers;
        if(!error && response.statusCode === 200) {
            fn&&fn({
                fileType:headers['x-upyun-file-type'],
                fileSize:headers['x-upyun-file-size'],
                createDate:headers['x-upyun-file-date'],
                fileMd5:headers['content-md5']
            })
        }
    })
}
/*
 * 列出文件夹下的文件* 
 */ 
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
/*
 * bucket 的使用量
 */
function bucketUsage(bucket, fn) {
    var uri = '/' + bucket + '/?usage';
    var url = Config.upyun.API_URL + uri;
    var header = formAPI.getAuth(uri, 'GET');

    request({
        url:url,
        method:'GET',
        headers: {
            'User-Agent': 'request/2.83.0',
            'Date' : (new Date).toGMTString(),
            'Authorization' : header
        },
        timeout:15000
    }, function(error, response, body) {
        fn && fn(+body)
    })
}
/*
 * 新建文件夹
 */
function createFolder(bucket, folder, fn) {
    var uri = '/' + bucket + '/' + folder;
    var url = Config.upyun.API_URL + uri;
    var header = formAPI.getAuth(uri, 'POST');
    
    request({
        url:url,
        method:'POST',
        headers:{
            'User-Agent': 'request/2.83.0',
            'Date' : (new Date).toGMTString(),
            'Authorization' : header,
            'folder' : true
        },
        timeout:15000
    }, function(error, response, body) {
        if(!error && response.statusCode===200) {
            fn&&fn(true)
        }
    })
}

/*
 * 删除空的文件夹或目录
 */
function deleteFile(bucket, name, fn) {
    var uri = '/' + bucket + '/' + name;
    var url = Config.upyun.API_URL + uri;
    var header = formAPI.getAuth(uri, 'DELETE');

    request({
        url:url,
        method:'DELETE',
        headers:{
            'User-Agent': 'request/2.83.0',
            'Date' : (new Date).toGMTString(),
            'Authorization' : header
        },
        timeout:15000
    }, function(error, response, body){
        console.log('Headers->', response.headers);
        console.log('Body->', body);
    })
}


module.exports = {
    fileInfo,
    listFile,
    bucketUsage,
    createFolder,
    deleteFile
};
