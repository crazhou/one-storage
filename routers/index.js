const express = require('express');
const path = require('path');
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
        
        app.get('/wx004', function(req, res) {

        });

        app.post('/wx004', function(req, res){

        });
    }
}