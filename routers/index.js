const express = require('express');
const path = require('path');
const encrypt = require('../tools/encrypt')
const formapi = require('../tools/formapi');
const Config = require('../config/api');

module.exports = {
    init:function(app) {

        let UpyunConfig = Config.upyun;
        // 取生成的Policy 和 Sign
        app.get('/fetchSign', function(req, res) {
            
            let file = req.query.f;
            
            let formurl = UpyunConfig.API_URL + '/' + UpyunConfig.bucket;

            let operator = UpyunConfig.operator;

            if(file) {
                let sign = formapi.genSign(file);
                let policy = formapi.genPolicy(file);
                res.json({
                    code:1000,
                    data: {
                        sign,
                        policy,
                        formurl,
                        operator
                    }
                });
            } else {
                res.json({
                    code:1001,
                    errMsg: '文件名不能为空!'
                });
            }
        });

        /*
         * 静态文件选项
         */
        let options = {
            etag:true,
            maxAge:'id',
            dotfiles: 'ignore',
            setHeaders: function (res, path, stat) {
                res.set('x-timestamp', Date.now());
            }
        };

        app.use(express.static(path.resolve(__dirname, '../public'), options));

        /*
         * 微信相关处理 Token验证
         */

        let WxConfig = Config.weixin;
        
        app.get('/wx004', function(req, res) {
            let echostr = req.query.echostr,
                nonce = req.query.nonce,
                signature = req.query.signature,
                timestamp = req.query.timestamp;

            let mm = [WxConfig.Token, timestamp, nonce].sort().join('');
            let cSign = encrypt.sha1(mm);

            if(cSign === signature) {
                res.send(echostr);
            } else {
                res.send('bad Token');
            }

        });

        app.post('/wx004', function(req, res) {

            res.send('success');
        });
    }
}