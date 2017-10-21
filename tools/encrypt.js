const crypto = require('crypto');
const fs = require('fs');

exports.sha1 = function(str) {
    let shatmp = crypto.createHash('sha1');
    shatmp.update(str);
    return shatmp.digest('hex');
};

exports.md5 = function(str) {
    let md5sum = crypto.createHash('md5');
    md5sum.update(str);
    return md5sum.digest('hex');
};



/*
 * 计算文件的md5
 * 
 */ 
exports.md5_file = function(filename, fn) {
    let hash = crypto.createHash('md5');

    fs.access(filename, fs.constants.R_OK , function(err) {
        if(err) throw err;
        let input = fs.createReadStream(filename);
        hash.on('readable', () => {
            let buf = hash.read();
            if(buf) {
                fn&&fn(buf.toString('hex'));
            }
        });
        input.pipe(hash);

    });
};

exports.base64_encode = function(str) {
    let buf = Buffer.from(str);

    return buf.toString('base64');
};


exports.base64_decode = function(str) {
    let buf = Buffer.from(str, 'base64');

    return buf.toString('utf8');
};